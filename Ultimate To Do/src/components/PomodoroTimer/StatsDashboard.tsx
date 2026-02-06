import React from 'react';
import { Flame, TrendingUp, Award, Clock } from 'lucide-react';
import type { UserStats } from '../../types/pomodoro';

interface StatsDashboardProps {
  stats: UserStats | null;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="text-center text-gray-500">
        No statistics available yet.
      </div>
    );
  }

  const averageMinutes = stats.total_tasks_completed > 0
    ? Math.round(stats.total_study_minutes / stats.total_tasks_completed)
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-orange-50 rounded-lg p-4 text-center">
        <Flame className="mx-auto text-orange-600 mb-2" size={32} />
        <div className="text-3xl font-bold text-gray-900">{stats.current_streak}</div>
        <div className="text-sm text-gray-600 mt-1">Current Streak</div>
        <div className="text-xs text-gray-500">days</div>
      </div>

      <div className="bg-purple-50 rounded-lg p-4 text-center">
        <Award className="mx-auto text-purple-600 mb-2" size={32} />
        <div className="text-3xl font-bold text-gray-900">{stats.longest_streak}</div>
        <div className="text-sm text-gray-600 mt-1">Longest Streak</div>
        <div className="text-xs text-gray-500">days</div>
      </div>

      <div className="bg-green-50 rounded-lg p-4 text-center">
        <TrendingUp className="mx-auto text-green-600 mb-2" size={32} />
        <div className="text-3xl font-bold text-gray-900">{averageMinutes}</div>
        <div className="text-sm text-gray-600 mt-1">Average Session</div>
        <div className="text-xs text-gray-500">minutes</div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 text-center">
        <Clock className="mx-auto text-blue-600 mb-2" size={32} />
        <div className="text-3xl font-bold text-gray-900">{stats.total_study_minutes}</div>
        <div className="text-sm text-gray-600 mt-1">Total Time</div>
        <div className="text-xs text-gray-500">minutes</div>
      </div>
    </div>
  );
};
