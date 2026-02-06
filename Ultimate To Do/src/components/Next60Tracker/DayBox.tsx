import React from 'react';
import { getColorClass } from '../../utils/colorLogic';
import type { DayTracker } from '../../types/tracker';
import { format, parseISO } from 'date-fns';

interface DayBoxProps {
  day: DayTracker;
  onClick: () => void;
}

export const DayBox: React.FC<DayBoxProps> = ({ day, onClick }) => {
  const colorClass = getColorClass(day.completion_status);
  
  const formatDisplayDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM dd');
    } catch {
      return dateStr;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`${colorClass} rounded-lg p-3 transition-all hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center min-h-[80px] w-full`}
    >
      <div className="text-white font-bold text-lg">Day {day.day_number}</div>
      <div className="text-white text-xs mt-1">{formatDisplayDate(day.date)}</div>
      <div className="text-white text-xs mt-1">
        {day.tasks_completed}/{day.tasks_total}
      </div>
    </button>
  );
};
