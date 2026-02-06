import { create } from 'zustand';
import type { DayTracker } from '../types/tracker';
import type { Task } from '../types/task';
import {
  initialize60Days,
  getDayTrackerData,
  assignTaskToDay,
  updateDayStatus,
  getTasksForDay,
} from '../utils/tauri';

interface TrackerStore {
  days: DayTracker[];
  selectedDay: number | null;
  selectedDayTasks: Task[];
  isLoading: boolean;
  error: string | null;
  initializeDays: () => Promise<void>;
  fetchDays: () => Promise<void>;
  assignTask: (taskId: number, dayNumber: number, assignedBy: string) => Promise<void>;
  selectDay: (dayNumber: number) => Promise<void>;
  clearSelection: () => void;
}

export const useTrackerStore = create<TrackerStore>((set, get) => ({
  days: [],
  selectedDay: null,
  selectedDayTasks: [],
  isLoading: false,
  error: null,

  initializeDays: async () => {
    set({ isLoading: true, error: null });
    try {
      await initialize60Days();
      await get().fetchDays();
    } catch (error) {
      set({ error: String(error), isLoading: false });
    }
  },

  fetchDays: async () => {
    set({ isLoading: true, error: null });
    try {
      const days = await getDayTrackerData();
      set({ days, isLoading: false });
    } catch (error) {
      set({ error: String(error), isLoading: false });
    }
  },

  assignTask: async (taskId: number, dayNumber: number, assignedBy: string) => {
    try {
      await assignTaskToDay(taskId, dayNumber, assignedBy);
      await updateDayStatus(dayNumber);
      await get().fetchDays();
      if (get().selectedDay === dayNumber) {
        await get().selectDay(dayNumber);
      }
    } catch (error) {
      set({ error: String(error) });
    }
  },

  selectDay: async (dayNumber: number) => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await getTasksForDay(dayNumber);
      set({ selectedDay: dayNumber, selectedDayTasks: tasks, isLoading: false });
    } catch (error) {
      set({ error: String(error), isLoading: false });
    }
  },

  clearSelection: () => {
    set({ selectedDay: null, selectedDayTasks: [] });
  },
}));
