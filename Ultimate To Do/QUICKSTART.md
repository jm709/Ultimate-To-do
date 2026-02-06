# Quick Start Guide

## Prerequisites

Before running the app, ensure you have:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   
2. **Rust** (latest stable version)
   - Install from: https://rustup.rs/
   - After installation, run: `rustup default stable`

3. **C++ Build Tools** (Windows only)
   - Install Visual Studio Build Tools or Visual Studio with C++ development tools

## Installation Steps

### 1. Navigate to Project Directory

```bash
cd "Ultimate To Do"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run tauri dev
```

The app will compile and launch automatically.

## First Time Setup

When you first run the app:

1. **Tasks Tab**: 
   - Click "Add Task" to create your first task
   - Add subtasks by clicking the "+" icon on any task
   - Check off tasks as you complete them

2. **Next 60 Tab**:
   - The tracker will automatically initialize with 60 days
   - Click "Assign Task to Day" to assign tasks to specific days
   - Click on any day box to view details and mark tasks complete

3. **Pomodoro Tab**:
   - Select a duration (15, 25, 45, or 60 minutes)
   - Optionally link a task from your to-do list
   - Click "Start Session" to begin your focused work

## Building for Production

To create an installer:

```bash
npm run tauri build
```

The installer will be in: `src-tauri/target/release/bundle/`

## Troubleshooting

### "rustup could not choose a version"
Run: `rustup default stable`

### "npm not found"
Install Node.js from https://nodejs.org/

### Build errors on Windows
Install Visual Studio Build Tools with C++ support

### Port 1420 already in use
Close other Vite/dev servers or change port in `tauri.conf.json`

## Features Overview

### Task Management
- ✅ Create tasks with descriptions and due dates
- ✅ Unlimited subtask nesting
- ✅ Automatic parent-child completion
- ✅ Recurring task support
- ✅ Overdue task highlighting

### 60-Day Tracker
- ✅ Visual progress tracking
- ✅ Color-coded completion status
- ✅ Manual task assignment
- ✅ Daily task management

### Pomodoro Timer
- ✅ Customizable durations
- ✅ Task linking
- ✅ Session history
- ✅ Statistics tracking (streak, average, total time)

## Database Location

The SQLite database (`ultimate_todo.db`) is stored in the same directory as the executable.

To reset the database, simply delete the `.db` file and restart the app.

## Support

For issues or questions, please refer to the main README.md file.
