import React from 'react';
import { getColorClass } from '../../utils/colorLogic';
import type { DayTracker } from '../../types/tracker';
import { format, parseISO } from 'date-fns';
import { isFutureDate } from '../../utils/dateHelpers';

interface DayBoxProps {
  day: DayTracker;
  onClick: () => void;
}

export const DayBox: React.FC<DayBoxProps> = ({ day, onClick }) => {
  const isFuture = isFutureDate(day.date);  
  const colorClass = getColorClass(day.completion_status, isFuture);
  const formatDisplayDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MM/dd');
    } catch {
      return dateStr;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`${colorClass} rounded-lg p-2 transition-all hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center min-h-[90px] w-full relative border-2 border-white/20`}
    >
      <div className="text-white font-bold text-2xl mb-1">{day.day_number}</div>
      <div className="text-white/90 text-xs font-medium">{formatDisplayDate(day.date)}</div>
      <div className="text-white/90 text-xs mt-1 font-semibold">
        {day.tasks_total > 0 ? `${day.tasks_completed}/${day.tasks_total}` : 'No tasks'}
      </div>
    </button>
  );
};
