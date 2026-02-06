import React, { useEffect, useState } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { usePomodoroStore } from '../../stores/pomodoroStore';
import { useTaskStore } from '../../stores/taskStore';
import { TimerDisplay } from './TimerDisplay';
import { TaskSelector } from './TaskSelector';
import { SessionHistory } from './SessionHistory';
import { StatsDashboard } from './StatsDashboard';
import { Button } from '../common/Button';

export const PomodoroTimer: React.FC = () => {
  const {
    sessionId,
    timeRemaining,
    isRunning,
    stats,
    history,
    startSession,
    completeSession,
    pauseSession,
    resumeSession,
    setTimeRemaining,
    fetchStats,
    fetchHistory,
  } = usePomodoroStore();

  const { tasks, fetchTasks } = useTaskStore();

  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [duration, setDuration] = useState(25);

  useEffect(() => {
    fetchStats();
    fetchHistory(7);
    fetchTasks();
  }, [fetchStats, fetchHistory, fetchTasks]);

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0 && sessionId) {
      // Timer completed
      completeSession();
      // Play notification sound (if available)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Complete!', {
          body: 'Great job! Time for a break.',
        });
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining, sessionId, setTimeRemaining, completeSession]);

  const handleStart = async () => {
    await startSession(selectedTaskId, duration);
  };

  const handlePause = () => {
    pauseSession();
  };

  const handleResume = () => {
    resumeSession();
  };

  const handleStop = async () => {
    if (sessionId) {
      await completeSession();
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pomodoro Timer</h1>
        <p className="text-gray-600">
          Stay focused and productive with the Pomodoro Technique.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Timer Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <TimerDisplay timeRemaining={timeRemaining} />

          {!sessionId ? (
            <div className="mt-8 space-y-4">
              <TaskSelector
                tasks={tasks}
                selectedTaskId={selectedTaskId}
                onSelectTask={setSelectedTaskId}
              />

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Duration (minutes)
                </label>
                <div className="flex space-x-2">
                  {[15, 25, 45, 60].map((minutes) => (
                    <button
                      key={minutes}
                      onClick={() => setDuration(minutes)}
                      className={`flex-1 py-2 rounded transition-colors ${
                        duration === minutes
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {minutes}m
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleStart} className="w-full" size="lg">
                <Play size={20} className="inline mr-2" />
                Start Session
              </Button>
            </div>
          ) : (
            <div className="mt-8 flex space-x-2">
              {isRunning ? (
                <Button onClick={handlePause} variant="secondary" className="flex-1" size="lg">
                  <Pause size={20} className="inline mr-2" />
                  Pause
                </Button>
              ) : (
                <Button onClick={handleResume} variant="primary" className="flex-1" size="lg">
                  <Play size={20} className="inline mr-2" />
                  Resume
                </Button>
              )}
              <Button onClick={handleStop} variant="danger" className="flex-1" size="lg">
                <Square size={20} className="inline mr-2" />
                Stop
              </Button>
            </div>
          )}
        </div>

        {/* Session History */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <SessionHistory sessions={history} />
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Statistics</h2>
        <StatsDashboard stats={stats} />
      </div>
    </div>
  );
};
