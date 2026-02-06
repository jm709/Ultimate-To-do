export interface PomodoroSession {
  id: number;
  task_id?: number;
  start_time: string;
  end_time?: string;
  duration_minutes: number;
  completed: boolean;
  date: string;
}

export interface UserStats {
  id: number;
  current_streak: number;
  longest_streak: number;
  total_tasks_completed: number;
  total_study_minutes: number;
  last_study_date?: string;
}
