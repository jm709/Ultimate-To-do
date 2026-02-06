import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Checkbox } from '../common/Checkbox';
import { Button } from '../common/Button';
import type { DayTracker } from '../../types/tracker';
import type { Task } from '../../types/task';
import { format, parseISO } from 'date-fns';

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: DayTracker | null;
  tasks: Task[];
  onToggleTask: (taskId: number) => void;
  onAssignTask?: (dayNumber: number) => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  isOpen,
  onClose,
  day,
  tasks,
  onToggleTask,
  onAssignTask,
}) => {
  if (!day) return null;

  const formatDisplayDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'EEEE, MMMM dd, yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Day ${day.day_number}`}>
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          {formatDisplayDate(day.date)}
        </div>

        <div className="bg-gray-100 rounded p-3">
          <div className="text-sm font-medium">
            Progress: {day.tasks_completed} / {day.tasks_total} tasks completed
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Assigned Tasks:</h3>
            {onAssignTask && (
              <Button
                size="sm"
                onClick={() => {
                  onAssignTask(day.day_number);
                  onClose();
                }}
              >
                <Plus size={16} className="inline mr-1" />
                Add Task
              </Button>
            )}
          </div>
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-sm">No tasks assigned to this day yet.</p>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
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
                        task.is_completed ? 'line-through text-gray-500' : ''
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
    </Modal>
  );
};
