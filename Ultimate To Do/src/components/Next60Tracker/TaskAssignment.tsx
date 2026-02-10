import React, { useState } from 'react';
import { Button } from '../common/Button';
import type { Task } from '../../types/task';

interface TaskAssignmentProps {
  tasks: Task[];
  onAssign: (taskId: number) => void;
  onClose: () => void;
}

export const TaskAssignment: React.FC<TaskAssignmentProps> = ({
  tasks,
  onAssign,
  onClose,
}) => {
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAssign = async () => {
    if (!selectedTask) {
      setError('Please select a task');
      return;
    }
    
    setError(null);
    onAssign(selectedTask);
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
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

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
