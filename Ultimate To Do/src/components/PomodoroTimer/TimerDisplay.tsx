import React from 'react';

interface TimerDisplayProps {
  timeRemaining: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeRemaining }) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="text-center">
      <div className="text-8xl font-bold text-gray-900 mb-4 font-mono">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="text-gray-600 text-lg">
        {timeRemaining > 0 ? 'Time Remaining' : 'Time\'s Up!'}
      </div>
    </div>
  );
};
