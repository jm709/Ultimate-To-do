import React, { useState } from 'react';
import { Button } from '../common/Button';
import type { Task } from '../../types/task';

interface TaskAssignmentProps {
  tasks: Task[];
  selectedDay: number | null;
  onAssign: (taskId: number, dayNumber: number) => void;
  onClose: () => void;
}

export const TaskAssignment: React.FC<TaskAssignmentProps> = ({
  tasks,
  selectedDay: initialDay,
  onAssign,
  onClose,
}) => {
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(initialDay || 1);

  const handleAssign = () => {
    if (selectedTask && selectedDay) {
      onAssign(selectedTask, selectedDay);
      onClose();
    }
  };

  // Flatten tasks to include subtasks
  const flattenTasks = (taskList: Task[]): Task[] => {
    const result: Task[] = [];
    taskList.forEach((task) => {
      result.push(task);
      if (task.subtasks && task.subtasks.length > 0) {
        result.push(...flattenTasks(task.subtasks));
      }
    });
    return result;
  };

  const allTasks = flattenTasks(tasks);
  const incompleteTasks = allTasks.filter((task) => !task.is_completed);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Day (1-60)
        </label>
        <input
          type="number"
          min="1"
          max="60"
          value={selectedDay}
          onChange={(e) => setSelectedDay(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <p className="text-sm text-gray-600">
        Select a task to assign:
      </p>

      {incompleteTasks.length === 0 ? (
        <p className="text-gray-500 text-sm">No incomplete tasks available to assign.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {incompleteTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => setSelectedTask(task.id)}
              className={`w-full text-left p-3 rounded border transition-colors ${
                selectedTask === task.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">{task.title}</div>
              {task.description && (
                <div className="text-sm text-gray-600 mt-1">{task.description}</div>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex space-x-2">
        <Button
          onClick={handleAssign}
          disabled={!selectedTask}
          variant="primary"
        >
          Assign Task
        </Button>
        <Button onClick={onClose} variant="secondary">
          Cancel
        </Button>
      </div>
    </div>
  );
};
