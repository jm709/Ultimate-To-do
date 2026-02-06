import { create } from 'zustand';
import type { PomodoroSession, UserStats } from '../types/pomodoro';
import {
  startPomodoroSession,
  completePomodoroSession,
  getPomodoroStats,
  getSessionHistory,
} from '../utils/tauri';

interface PomodoroStore {
  currentSession: PomodoroSession | null;
  sessionId: number | null;
  timeRemaining: number;
  isRunning: boolean;
  stats: UserStats | null;
  history: PomodoroSession[];
  isLoading: boolean;
  error: string | null;
  startSession: (taskId: number | null, durationMinutes: number) => Promise<void>;
  completeSession: () => Promise<void>;
  pauseSession: () => void;
  resumeSession: () => void;
  setTimeRemaining: (time: number) => void;
  fetchStats: () => Promise<void>;
  fetchHistory: (days?: number) => Promise<void>;
}

export const usePomodoroStore = create<PomodoroStore>((set, get) => ({
  currentSession: null,
  sessionId: null,
  timeRemaining: 0,
  isRunning: false,
  stats: null,
  history: [],
  isLoading: false,
  error: null,

  startSession: async (taskId: number | null, durationMinutes: number) => {
    try {
      const sessionId = await startPomodoroSession(taskId, durationMinutes);
      set({
        sessionId,
        timeRemaining: durationMinutes * 60,
        isRunning: true,
        error: null,
      });
    } catch (error) {
      set({ error: String(error) });
    }
  },

  completeSession: async () => {
    const { sessionId } = get();
    if (!sessionId) return;

    try {
      await completePomodoroSession(sessionId);
      set({
        currentSession: null,
        sessionId: null,
        timeRemaining: 0,
        isRunning: false,
      });
      await get().fetchStats();
      await get().fetchHistory();
    } catch (error) {
      set({ error: String(error) });
    }
  },

  pauseSession: () => {
    set({ isRunning: false });
  },

  resumeSession: () => {
    set({ isRunning: true });
  },

  setTimeRemaining: (time: number) => {
    set({ timeRemaining: time });
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await getPomodoroStats();
      set({ stats, isLoading: false });
    } catch (error) {
      set({ error: String(error), isLoading: false });
    }
  },

  fetchHistory: async (days?: number) => {
    set({ isLoading: true, error: null });
    try {
      const history = await getSessionHistory(days);
      set({ history, isLoading: false });
    } catch (error) {
      set({ error: String(error), isLoading: false });
    }
  },
}));
