import React from 'react';

interface RecurringOptionsProps {
  isRecurring: boolean;
  recurrencePattern: string;
  onRecurringChange: (isRecurring: boolean) => void;
  onPatternChange: (pattern: string) => void;
}

export const RecurringOptions: React.FC<RecurringOptionsProps> = ({
  isRecurring,
  recurrencePattern,
  onRecurringChange,
  onPatternChange,
}) => {
  return (
    <div className="space-y-3 border-t pt-3">
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={(e) => onRecurringChange(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="text-sm font-medium text-gray-700">Make this a recurring task</span>
      </label>

      {isRecurring && (
        <div className="ml-6 space-y-2">
          <label className="block text-sm text-gray-600">Repeat:</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="recurrence"
                value="daily"
                checked={recurrencePattern === 'daily'}
                onChange={(e) => onPatternChange(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Daily</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="recurrence"
                value="weekly"
                checked={recurrencePattern === 'weekly'}
                onChange={(e) => onPatternChange(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Weekly</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="recurrence"
                value="monthly"
                checked={recurrencePattern === 'monthly'}
                onChange={(e) => onPatternChange(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Monthly</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
