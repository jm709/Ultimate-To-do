use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

pub struct DbState {
    pub conn: Mutex<Connection>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Task {
    pub id: i64,
    pub title: String,
    pub description: Option<String>,
    pub is_completed: bool,
    pub parent_id: Option<i64>,
    pub due_date: Option<String>,
    pub is_recurring: bool,
    pub recurrence_pattern: Option<String>,
    pub created_at: String,
    pub subtasks: Vec<Task>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DayTracker {
    pub id: i64,
    pub day_number: i32,
    pub date: String,
    pub completion_status: String,
    pub tasks_completed: i32,
    pub tasks_total: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TaskAssignment {
    pub id: i64,
    pub task_id: i64,
    pub day_number: i32,
    pub assigned_by: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PomodoroSession {
    pub id: i64,
    pub task_id: Option<i64>,
    pub start_time: String,
    pub end_time: Option<String>,
    pub duration_minutes: i32,
    pub completed: bool,
    pub date: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserStats {
    pub id: i64,
    pub current_streak: i32,
    pub longest_streak: i32,
    pub total_tasks_completed: i32,
    pub total_study_minutes: i32,
    pub last_study_date: Option<String>,
}

pub fn initialize_database() -> Result<Connection> {
    let conn = Connection::open("ultimate_todo.db")?;

    // Create tasks table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            is_completed BOOLEAN NOT NULL DEFAULT 0,
            parent_id INTEGER,
            due_date TEXT,
            is_recurring BOOLEAN NOT NULL DEFAULT 0,
            recurrence_pattern TEXT,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (parent_id) REFERENCES tasks(id) ON DELETE CASCADE
        )",
        [],
    )?;

    // Create day_tracker table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS day_tracker (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            day_number INTEGER NOT NULL UNIQUE,
            date TEXT NOT NULL,
            completion_status TEXT NOT NULL DEFAULT 'red',
            tasks_completed INTEGER NOT NULL DEFAULT 0,
            tasks_total INTEGER NOT NULL DEFAULT 0
        )",
        [],
    )?;

    // Create task_assignments table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS task_assignments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id INTEGER NOT NULL,
            day_number INTEGER NOT NULL,
            assigned_by TEXT NOT NULL DEFAULT 'manual',
            FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
            FOREIGN KEY (day_number) REFERENCES day_tracker(day_number) ON DELETE CASCADE
        )",
        [],
    )?;

    // Create pomodoro_sessions table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS pomodoro_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id INTEGER,
            start_time TEXT NOT NULL,
            end_time TEXT,
            duration_minutes INTEGER NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT 0,
            date TEXT NOT NULL,
            FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
        )",
        [],
    )?;

    // Create user_stats table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS user_stats (
            id INTEGER PRIMARY KEY DEFAULT 1,
            current_streak INTEGER NOT NULL DEFAULT 0,
            longest_streak INTEGER NOT NULL DEFAULT 0,
            total_tasks_completed INTEGER NOT NULL DEFAULT 0,
            total_study_minutes INTEGER NOT NULL DEFAULT 0,
            last_study_date TEXT
        )",
        [],
    )?;

    // Initialize user_stats if not exists
    conn.execute(
        "INSERT OR IGNORE INTO user_stats (id, current_streak, longest_streak, total_tasks_completed, total_study_minutes)
         VALUES (1, 0, 0, 0, 0)",
        [],
    )?;

    Ok(conn)
}
