import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import type { PomodoroSession } from '../../types/pomodoro';
import { formatTime } from '../../utils/dateHelpers';

interface SessionHistoryProps {
  sessions: PomodoroSession[];
}

export const SessionHistory: React.FC<SessionHistoryProps> = ({ sessions }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Recent Sessions</h3>
      
      {sessions.length === 0 ? (
        <p className="text-gray-500 text-sm">No sessions yet. Start your first Pomodoro!</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="border rounded p-3 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                {session.completed ? (
                  <CheckCircle className="text-green-600" size={20} />
                ) : (
                  <XCircle className="text-gray-400" size={20} />
                )}
                <div>
                  <div className="text-sm font-medium">
                    {session.duration_minutes} minutes
                  </div>
                  <div className="text-xs text-gray-600">
                    {formatTime(session.start_time)}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <Clock size={14} />
                <span className="text-xs">{session.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
