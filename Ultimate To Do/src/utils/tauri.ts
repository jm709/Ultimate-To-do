import { invoke } from '@tauri-apps/api/core';
import type { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';
import type { DayTracker } from '../types/tracker';
import type { PomodoroSession, UserStats } from '../types/pomodoro';

// Task Commands
export const createTask = async (input: CreateTaskInput): Promise<number> => {
  return await invoke('create_task', {
    title: input.title,
    description: input.description,
    dueDate: input.due_date,
    isRecurring: input.is_recurring,
    recurrencePattern: input.recurrence_pattern,
    parentId: input.parent_id,
  });
};

export const getAllTasks = async (): Promise<Task[]> => {
  return await invoke('get_all_tasks');
};

export const updateTask = async (input: UpdateTaskInput): Promise<void> => {
  return await invoke('update_task', {
    id: input.id,
    title: input.title,
    description: input.description,
    dueDate: input.due_date,
    isRecurring: input.is_recurring,
    recurrencePattern: input.recurrence_pattern,
  });
};

export const deleteTask = async (id: number): Promise<void> => {
  return await invoke('delete_task', { id });
};

export const toggleTaskCompletion = async (id: number): Promise<boolean> => {
  return await invoke('toggle_task_completion', { id });
};

// Day Tracker Commands
export const initialize60Days = async (): Promise<void> => {
  return await invoke('initialize_60_days');
};

export const getDayTrackerData = async (): Promise<DayTracker[]> => {
  return await invoke('get_day_tracker_data');
};

export const assignTaskToDay = async (
  taskId: number,
  dayNumber: number,
  assignedBy: string
): Promise<void> => {
  return await invoke('assign_task_to_day', {
    taskId,
    dayNumber,
    assignedBy,
  });
};

export const updateDayStatus = async (dayNumber: number): Promise<void> => {
  return await invoke('update_day_status', { dayNumber });
};

export const getTasksForDay = async (dayNumber: number): Promise<Task[]> => {
  return await invoke('get_tasks_for_day', { dayNumber });
};

// Pomodoro Commands
export const startPomodoroSession = async (
  taskId: number | null,
  durationMinutes: number
): Promise<number> => {
  return await invoke('start_pomodoro_session', {
    taskId,
    durationMinutes,
  });
};

export const completePomodoroSession = async (sessionId: number): Promise<void> => {
  return await invoke('complete_pomodoro_session', { sessionId });
};

export const getPomodoroStats = async (): Promise<UserStats> => {
  return await invoke('get_pomodoro_stats');
};

export const getSessionHistory = async (days?: number): Promise<PomodoroSession[]> => {
  return await invoke('get_session_history', { days });
};
