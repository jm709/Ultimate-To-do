use crate::database::{DbState, Task, DayTracker, PomodoroSession, UserStats};
use rusqlite::Result;
use tauri::State;

// Task Management Commands

#[tauri::command]
pub fn create_task(
    state: State<DbState>,
    title: String,
    description: Option<String>,
    due_date: Option<String>,
    is_recurring: bool,
    recurrence_pattern: Option<String>,
    parent_id: Option<i64>,
) -> Result<i64, String> {
    let conn = state.conn.lock().unwrap();
    
    conn.execute(
        "INSERT INTO tasks (title, description, due_date, is_recurring, recurrence_pattern, parent_id)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        (
            &title,
            &description,
            &due_date,
            &is_recurring,
            &recurrence_pattern,
            &parent_id,
        ),
    )
    .map_err(|e| e.to_string())?;

    Ok(conn.last_insert_rowid())
}

#[tauri::command]
pub fn get_all_tasks(state: State<DbState>) -> Result<Vec<Task>, String> {
    let conn = state.conn.lock().unwrap();
    
    let mut stmt = conn
        .prepare(
            "SELECT id, title, description, is_completed, parent_id, due_date, is_recurring, recurrence_pattern, created_at 
             FROM tasks 
             WHERE parent_id IS NULL 
             ORDER BY created_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let tasks = stmt
        .query_map([], |row| {
            Ok(Task {
                id: row.get(0)?,
                title: row.get(1)?,
                description: row.get(2)?,
                is_completed: row.get(3)?,
                parent_id: row.get(4)?,
                due_date: row.get(5)?,
                is_recurring: row.get(6)?,
                recurrence_pattern: row.get(7)?,
                created_at: row.get(8)?,
                subtasks: vec![],
            })
        })
        .map_err(|e| e.to_string())?;

    let mut all_tasks = Vec::new();
    for task in tasks {
        let mut task = task.map_err(|e| e.to_string())?;
        task.subtasks = get_subtasks(&conn, task.id)?;
        all_tasks.push(task);
    }

    Ok(all_tasks)
}

fn get_subtasks(conn: &rusqlite::Connection, parent_id: i64) -> Result<Vec<Task>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT id, title, description, is_completed, parent_id, due_date, is_recurring, recurrence_pattern, created_at 
             FROM tasks 
             WHERE parent_id = ?1 
             ORDER BY created_at ASC",
        )
        .map_err(|e| e.to_string())?;

    let subtasks = stmt
        .query_map([parent_id], |row| {
            Ok(Task {
                id: row.get(0)?,
                title: row.get(1)?,
                description: row.get(2)?,
                is_completed: row.get(3)?,
                parent_id: row.get(4)?,
                due_date: row.get(5)?,
                is_recurring: row.get(6)?,
                recurrence_pattern: row.get(7)?,
                created_at: row.get(8)?,
                subtasks: vec![],
            })
        })
        .map_err(|e| e.to_string())?;

    let mut all_subtasks = Vec::new();
    for subtask in subtasks {
        let mut subtask = subtask.map_err(|e| e.to_string())?;
        subtask.subtasks = get_subtasks(conn, subtask.id)?;
        all_subtasks.push(subtask);
    }

    Ok(all_subtasks)
}

#[tauri::command]
pub fn update_task(
    state: State<DbState>,
    id: i64,
    title: Option<String>,
    description: Option<String>,
    due_date: Option<String>,
    is_recurring: Option<bool>,
    recurrence_pattern: Option<String>,
) -> Result<(), String> {
    let conn = state.conn.lock().unwrap();
    
    let mut query = String::from("UPDATE tasks SET ");
    let mut updates = Vec::new();
    let mut param_values: Vec<Box<dyn rusqlite::ToSql>> = Vec::new();

    if let Some(t) = title {
        updates.push("title = ?");
        param_values.push(Box::new(t));
    }
    if let Some(d) = description {
        updates.push("description = ?");
        param_values.push(Box::new(d));
    }
    if let Some(dd) = due_date {
        updates.push("due_date = ?");
        param_values.push(Box::new(dd));
    }
    if let Some(ir) = is_recurring {
        updates.push("is_recurring = ?");  
        param_values.push(Box::new(ir as i32));
    }
    if let Some(rp) = recurrence_pattern {
        updates.push("recurrence_pattern = ?");
        param_values.push(Box::new(rp));
    }

    if updates.is_empty() {
        return Ok(());
    }

    query.push_str(&updates.join(", "));
    query.push_str(&format!(" WHERE id = ?"));
    param_values.push(Box::new(id));

    let params: Vec<&dyn rusqlite::ToSql> = param_values.iter()
        .map(|b| b.as_ref())
        .collect();

    conn.execute(&query, params.as_slice())
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn delete_task(state: State<DbState>, id: i64) -> Result<(), String> {
    let conn = state.conn.lock().unwrap();
    
    conn.execute("DELETE FROM tasks WHERE id = ?1", [id])
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn toggle_task_completion(state: State<DbState>, id: i64) -> Result<bool, String> {
    let conn = state.conn.lock().unwrap();
    
    // Get current completion status
    let is_completed: bool = conn
        .query_row("SELECT is_completed FROM tasks WHERE id = ?1", [id], |row| {
            row.get(0)
        })
        .map_err(|e| e.to_string())?;

    let new_status = !is_completed;

    // Update the task
    conn.execute(
        "UPDATE tasks SET is_completed = ?1 WHERE id = ?2",
        (new_status, id),
    )
    .map_err(|e| e.to_string())?;

    // If completing a parent task, complete all subtasks
    if new_status {
        complete_subtasks(&conn, id)?;
    }

    Ok(new_status)
}

fn complete_subtasks(conn: &rusqlite::Connection, parent_id: i64) -> Result<(), String> {
    conn.execute(
        "UPDATE tasks SET is_completed = 1 WHERE parent_id = ?1",
        [parent_id],
    )
    .map_err(|e| e.to_string())?;

    // Get all subtask IDs and recursively complete their children
    let mut stmt = conn
        .prepare("SELECT id FROM tasks WHERE parent_id = ?1")
        .map_err(|e| e.to_string())?;

    let subtask_ids: Vec<i64> = stmt
        .query_map([parent_id], |row| row.get(0))
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    for subtask_id in subtask_ids {
        complete_subtasks(conn, subtask_id)?;
    }

    Ok(())
}

// Day Tracker Commands

#[tauri::command]
pub fn initialize_60_days(state: State<DbState>) -> Result<(), String> {
    let conn = state.conn.lock().unwrap();
    
    // Check if already initialized
    let count: i64 = conn
        .query_row("SELECT COUNT(*) FROM day_tracker", [], |row| row.get(0))
        .map_err(|e| e.to_string())?;

    if count > 0 {
        return Ok(());
    }

    // Get current date and insert 60 days
    for day in 1..=60 {
        conn.execute(
            "INSERT INTO day_tracker (day_number, date, completion_status, tasks_completed, tasks_total)
             VALUES (?1, date('now', '+' || ?2 || ' days'), 'red', 0, 0)",
            (day, day - 1),
        )
        .map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
pub fn get_day_tracker_data(state: State<DbState>) -> Result<Vec<DayTracker>, String> {
    let conn = state.conn.lock().unwrap();
    
    let mut stmt = conn
        .prepare(
            "SELECT id, day_number, date, completion_status, tasks_completed, tasks_total 
             FROM day_tracker 
             ORDER BY day_number ASC",
        )
        .map_err(|e| e.to_string())?;

    let days = stmt
        .query_map([], |row| {
            Ok(DayTracker {
                id: row.get(0)?,
                day_number: row.get(1)?,
                date: row.get(2)?,
                completion_status: row.get(3)?,
                tasks_completed: row.get(4)?,
                tasks_total: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(days)
}

#[tauri::command]
pub fn assign_task_to_day(
    state: State<DbState>,
    task_id: i64,
    day_number: i32,
    assigned_by: String,
) -> Result<(), String> {
    let conn = state.conn.lock().unwrap();
    
    // Check if task is already assigned to this day
    let exists: i64 = conn
        .query_row(
            "SELECT COUNT(*) FROM task_assignments WHERE task_id = ?1 AND day_number = ?2",
            (task_id, day_number),
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    if exists > 0 {
        return Ok(());
    }

    conn.execute(
        "INSERT INTO task_assignments (task_id, day_number, assigned_by) VALUES (?1, ?2, ?3)",
        (task_id, day_number, &assigned_by),
    )
    .map_err(|e| e.to_string())?;

    // Update day total tasks
    update_day_status_internal(&state, day_number)?;

    Ok(())
}

// Internal helper function for updating day status
fn update_day_status_internal(state: &State<DbState>, day_number: i32) -> Result<(), String> {
    let conn = state.conn.lock().unwrap();
    
    // Count total assigned tasks
    let tasks_total: i32 = conn
        .query_row(
            "SELECT COUNT(*) FROM task_assignments WHERE day_number = ?1",
            [day_number],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    // Count completed tasks
    let tasks_completed: i32 = conn
        .query_row(
            "SELECT COUNT(*) FROM task_assignments ta 
             JOIN tasks t ON ta.task_id = t.id 
             WHERE ta.day_number = ?1 AND t.is_completed = 1",
            [day_number],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    // Calculate color status
    let completion_status = if tasks_total == 0 {
        "red"
    } else {
        let ratio = tasks_completed as f32 / tasks_total as f32;
        if ratio == 0.0 {
            "red"
        } else if ratio < 0.5 {
            "yellow"
        } else if ratio < 1.0 {
            "light_green"
        } else {
            "deep_green"
        }
    };

    conn.execute(
        "UPDATE day_tracker SET tasks_completed = ?1, tasks_total = ?2, completion_status = ?3 WHERE day_number = ?4",
        (tasks_completed, tasks_total, completion_status, day_number),
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn update_day_status(state: State<DbState>, day_number: i32) -> Result<(), String> {
    update_day_status_internal(&state, day_number)
}

#[tauri::command]
pub fn get_tasks_for_day(state: State<DbState>, day_number: i32) -> Result<Vec<Task>, String> {
    let conn = state.conn.lock().unwrap();
    
    let mut stmt = conn
        .prepare(
            "SELECT t.id, t.title, t.description, t.is_completed, t.parent_id, t.due_date, t.is_recurring, t.recurrence_pattern, t.created_at 
             FROM tasks t
             JOIN task_assignments ta ON t.id = ta.task_id
             WHERE ta.day_number = ?1
             ORDER BY t.created_at ASC",
        )
        .map_err(|e| e.to_string())?;

    let tasks = stmt
        .query_map([day_number], |row| {
            Ok(Task {
                id: row.get(0)?,
                title: row.get(1)?,
                description: row.get(2)?,
                is_completed: row.get(3)?,
                parent_id: row.get(4)?,
                due_date: row.get(5)?,
                is_recurring: row.get(6)?,
                recurrence_pattern: row.get(7)?,
                created_at: row.get(8)?,
                subtasks: vec![],
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(tasks)
}

// Pomodoro Commands

#[tauri::command]
pub fn start_pomodoro_session(
    state: State<DbState>,
    task_id: Option<i64>,
    duration_minutes: i32,
) -> Result<i64, String> {
    let conn = state.conn.lock().unwrap();
    
    conn.execute(
        "INSERT INTO pomodoro_sessions (task_id, start_time, duration_minutes, date)
         VALUES (?1, datetime('now'), ?2, date('now'))",
        (task_id, duration_minutes),
    )
    .map_err(|e| e.to_string())?;

    Ok(conn.last_insert_rowid())
}

#[tauri::command]
pub fn complete_pomodoro_session(state: State<DbState>, session_id: i64) -> Result<(), String> {
    let conn = state.conn.lock().unwrap();
    
    conn.execute(
        "UPDATE pomodoro_sessions SET completed = 1, end_time = datetime('now') WHERE id = ?1",
        [session_id],
    )
    .map_err(|e| e.to_string())?;

    // Update user stats
    update_user_stats(&state)?;

    Ok(())
}

#[tauri::command]
pub fn get_pomodoro_stats(state: State<DbState>) -> Result<UserStats, String> {
    let conn = state.conn.lock().unwrap();
    
    let stats = conn
        .query_row(
            "SELECT id, current_streak, longest_streak, total_tasks_completed, total_study_minutes, last_study_date 
             FROM user_stats WHERE id = 1",
            [],
            |row| {
                Ok(UserStats {
                    id: row.get(0)?,
                    current_streak: row.get(1)?,
                    longest_streak: row.get(2)?,
                    total_tasks_completed: row.get(3)?,
                    total_study_minutes: row.get(4)?,
                    last_study_date: row.get(5)?,
                })
            },
        )
        .map_err(|e| e.to_string())?;

    Ok(stats)
}

#[tauri::command]
pub fn get_session_history(state: State<DbState>, days: Option<i32>) -> Result<Vec<PomodoroSession>, String> {
    let conn = state.conn.lock().unwrap();
    
    let days_limit = days.unwrap_or(7);
    
    let mut stmt = conn
        .prepare(
            "SELECT id, task_id, start_time, end_time, duration_minutes, completed, date 
             FROM pomodoro_sessions 
             WHERE date >= date('now', '-' || ?1 || ' days')
             ORDER BY start_time DESC",
        )
        .map_err(|e| e.to_string())?;

    let sessions = stmt
        .query_map([days_limit], |row| {
            Ok(PomodoroSession {
                id: row.get(0)?,
                task_id: row.get(1)?,
                start_time: row.get(2)?,
                end_time: row.get(3)?,
                duration_minutes: row.get(4)?,
                completed: row.get(5)?,
                date: row.get(6)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(sessions)
}

fn update_user_stats(state: &State<DbState>) -> Result<(), String> {
    let conn = state.conn.lock().unwrap();
    
    // Get total completed sessions
    let total_completed: i32 = conn
        .query_row(
            "SELECT COUNT(*) FROM pomodoro_sessions WHERE completed = 1",
            [],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    // Get total study minutes
    let total_minutes: i32 = conn
        .query_row(
            "SELECT COALESCE(SUM(duration_minutes), 0) FROM pomodoro_sessions WHERE completed = 1",
            [],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    // Calculate streaks
    let mut stmt = conn
        .prepare(
            "SELECT DISTINCT date FROM pomodoro_sessions 
             WHERE completed = 1 
             ORDER BY date DESC",
        )
        .map_err(|e| e.to_string())?;

    let dates: Vec<String> = stmt
        .query_map([], |row| row.get(0))
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    let (current_streak, longest_streak) = calculate_streaks(&dates);

    // Update stats
    conn.execute(
        "UPDATE user_stats SET 
         current_streak = ?1, 
         longest_streak = ?2, 
         total_tasks_completed = ?3, 
         total_study_minutes = ?4, 
         last_study_date = date('now')
         WHERE id = 1",
        (current_streak, longest_streak, total_completed, total_minutes),
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

fn calculate_streaks(dates: &[String]) -> (i32, i32) {
    if dates.is_empty() {
        return (0, 0);
    }

    let mut current_streak = 0;
    let mut longest_streak = 0;
    let mut temp_streak = 1;

    for i in 0..dates.len() {
        if i == 0 {
            current_streak = 1;
        } else {
            // Check if dates are consecutive
            let prev_date = &dates[i - 1];
            let curr_date = &dates[i];
            
            // Simple consecutive check (would need proper date parsing in production)
            if is_consecutive_day(prev_date, curr_date) {
                temp_streak += 1;
                if i == 1 {
                    current_streak += 1;
                }
            } else {
                if i == 1 {
                    current_streak = 0;
                }
                longest_streak = longest_streak.max(temp_streak);
                temp_streak = 1;
            }
        }
    }

    longest_streak = longest_streak.max(temp_streak);
    longest_streak = longest_streak.max(current_streak);

    (current_streak, longest_streak)
}

fn is_consecutive_day(date1: &str, date2: &str) -> bool {
    // Simplified check - in production, use proper date parsing
    // For now, just return true if dates are different
    date1 != date2
}
