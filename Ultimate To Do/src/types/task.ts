export interface Task {
  id: number;
  title: string;
  description?: string;
  is_completed: boolean;
  parent_id?: number;
  due_date?: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  created_at: string;
  subtasks: Task[];
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  due_date?: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  parent_id?: number;
}

export interface UpdateTaskInput {
  id: number;
  title?: string;
  description?: string;
  due_date?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
}
