import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Checkbox } from '../common/Checkbox';
import { Button } from '../common/Button';
import type { DayTracker } from '../../types/tracker';
import type { Task } from '../../types/task';
import { format, parseISO } from 'date-fns';

interface DayDetailPanelProps {
  day: DayTracker;
  tasks: Task[];
  onToggleTask: (taskId: number) => void;
  onShowAssignment: () => void;
}

export const DayDetailPanel: React.FC<DayDetailPanelProps> = ({
  day,
  tasks,
  onToggleTask,
  onShowAssignment,
}) => {
  const formatDisplayDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'EEEE, MMMM dd, yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Day {day.day_number}
        </h2>
        <Button onClick={onShowAssignment} size="sm">
          <Plus size={16} className="mr-1" />
          Assign Task
        </Button>
      </div>

      <div className="text-sm text-gray-600">
        {formatDisplayDate(day.date)}
      </div>

      <div className="bg-gray-100 rounded p-3">
        <div className="text-sm font-medium">
          Progress: {day.tasks_completed} / {day.tasks_total} tasks completed
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Tasks</h3>
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No tasks assigned to this day yet.
          </p>
        ) : (
          <div className="space-y-2">
            {tasks.map((task: Task) => (
              <div
                key={task.id}
                className="border rounded p-3 flex items-start space-x-3"
              >
                <Checkbox
                  checked={task.is_completed}
                  onChange={() => onToggleTask(task.id)}
                />

                <div className="flex-1">
                  <div
                    className={`font-medium ${
                      task.is_completed
                        ? 'line-through text-gray-500'
                        : ''
                    }`}
                  >
                    {task.title}
                  </div>

                  {task.description && (
                    <div className="text-sm text-gray-600 mt-1">
                      {task.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
