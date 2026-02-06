import { create } from 'zustand';
import type { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
} from '../utils/tauri';

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (input: CreateTaskInput) => Promise<void>;
  editTask: (input: UpdateTaskInput) => Promise<void>;
  removeTask: (id: number) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await getAllTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ error: String(error), isLoading: false });
    }
  },

  addTask: async (input: CreateTaskInput) => {
    try {
      await createTask(input);
      await get().fetchTasks();
    } catch (error) {
      set({ error: String(error) });
    }
  },

  editTask: async (input: UpdateTaskInput) => {
    try {
      await updateTask(input);
      await get().fetchTasks();
    } catch (error) {
      set({ error: String(error) });
    }
  },

  removeTask: async (id: number) => {
    try {
      await deleteTask(id);
      await get().fetchTasks();
    } catch (error) {
      set({ error: String(error) });
    }
  },

  toggleTask: async (id: number) => {
    try {
      await toggleTaskCompletion(id);
      await get().fetchTasks();
    } catch (error) {
      set({ error: String(error) });
    }
  },
}));
