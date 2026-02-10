# Ultimate To-Do

A comprehensive productivity application built with Tauri, React, and TypeScript.

## Features

### To-Do List
- Create tasks with titles, descriptions, and due dates
- Organize tasks with unlimited subtask nesting
- Automatic subtask completion when parent task is completed
- Recurring tasks support (daily, weekly, monthly)
- Visual indication of overdue tasks

### Next 60 Days Tracker
- Visual 60-day progress tracker with color-coded status
- Manual task assignment to specific days
- Color indicators:
  - 🔴 Red: No tasks completed
  - 🟡 Yellow: Less than 50% complete
  - 🟢 Light Green: 50-99% complete
  - 🟢 Deep Green: 100% complete

### Pomodoro Timer
- Customizable session durations (15, 25, 45, 60 minutes)
- Optional task linking for focused work sessions
- Session history tracking
- Statistics dashboard:
  - Current study streak
  - Longest study streak
  - Average session duration
  - Total study time

## Tech Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **Backend**: Rust (Tauri 2)
- **Database**: SQLite (via rusqlite)
- **State Management**: Zustand
- **Icons**: Lucide React

## Development

### Prerequisites

- Node.js (v16 or higher)
- Rust (latest stable)
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in development mode:
   ```bash
   npm run tauri dev
   ```

### Build

To create a production build:

```bash
npm run tauri build
```

The installer will be created in `src-tauri/target/release/bundle/`.

## Project Structure

```
src/
├── components/
│   ├── TodoList/          # Task management components
│   ├── Next60Tracker/     # 60-day tracker components
│   ├── PomodoroTimer/     # Pomodoro timer components
│   └── common/            # Shared components
├── stores/                # Zustand state management
├── types/                 # TypeScript type definitions
├── utils/                 # Helper functions
└── App.tsx               # Main application component

src-tauri/
├── src/
│   ├── database.rs       # Database schema and types
│   ├── commands.rs       # Tauri command implementations
│   ├── lib.rs           # Application entry point
│   └── main.rs          # Binary entry point
└── Cargo.toml           # Rust dependencies
```

## Database Schema

The app uses SQLite with the following tables:
- `tasks` - Store tasks and subtasks
- `day_tracker` - Track 60-day progress
- `task_assignments` - Link tasks to specific days
- `pomodoro_sessions` - Record Pomodoro sessions
- `user_stats` - Store user statistics

## License

MIT
