import React from 'react';
import type { Task } from '../../types/task';

interface TaskSelectorProps {
  tasks: Task[];
  selectedTaskId: number | null;
  onSelectTask: (taskId: number | null) => void;
}

export const TaskSelector: React.FC<TaskSelectorProps> = ({
  tasks,
  selectedTaskId,
  onSelectTask,
}) => {
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
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Select Task (Optional)
      </label>
      <select
        value={selectedTaskId || ''}
        onChange={(e) => onSelectTask(e.target.value ? Number(e.target.value) : null)}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">No specific task</option>
        {incompleteTasks.map((task) => (
          <option key={task.id} value={task.id}>
            {task.title}
          </option>
        ))}
      </select>
    </div>
  );
};
