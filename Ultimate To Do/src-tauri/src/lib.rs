mod database;
mod commands;

use database::{initialize_database, DbState};
use std::sync::Mutex;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let conn = initialize_database().expect("Failed to initialize database");
    
    tauri::Builder::default()
        .manage(DbState {
            conn: Mutex::new(conn),
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::create_task,
            commands::get_all_tasks,
            commands::update_task,
            commands::delete_task,
            commands::toggle_task_completion,
            commands::initialize_60_days,
            commands::get_day_tracker_data,
            commands::assign_task_to_day,
            commands::update_day_status,
            commands::get_tasks_for_day,
            commands::start_pomodoro_session,
            commands::complete_pomodoro_session,
            commands::get_pomodoro_stats,
            commands::get_session_history,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
