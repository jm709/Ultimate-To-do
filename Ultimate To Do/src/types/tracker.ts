export interface DayTracker {
  id: number;
  day_number: number;
  date: string;
  completion_status: 'red' | 'yellow' | 'light_green' | 'deep_green';
  tasks_completed: number;
  tasks_total: number;
}

export interface TaskAssignment {
  id: number;
  task_id: number;
  day_number: number;
  assigned_by: 'manual' | 'ai';
}
