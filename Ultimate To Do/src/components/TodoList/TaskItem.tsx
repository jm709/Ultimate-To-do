import React, { useState } from 'react';
import { Trash2, Plus, Calendar } from 'lucide-react';
import { Checkbox } from '../common/Checkbox';
import { Button } from '../common/Button';
import { InlineTaskForm } from './InlineTaskForm';
import type { Task, CreateTaskInput } from '../../types/task';
import { formatDate, isOverdue } from '../../utils/dateHelpers';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onAddSubtask: (subtask: CreateTaskInput) => void;
  onTaskClick?: (taskId: number) => void;
  level?: number;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onAddSubtask,
  onTaskClick,
  level = 0,
}) => {
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);

  const handleAddSubtask = (subtask: CreateTaskInput) => {
    onAddSubtask(subtask);
    setShowSubtaskForm(false);
  };

  const indent = level * 24;
  const overdue = task.due_date && !task.is_completed && isOverdue(task.due_date);

  return (
    <div style={{ marginLeft: `${indent}px` }}>
      <div
        className={`border rounded-lg p-4 mb-2 transition-all ${
          task.is_completed ? 'bg-gray-50' : 'bg-white'
        } ${overdue ? 'border-red-400' : 'border-gray-200'} hover:shadow-md`}
      >
        <div className="flex items-start space-x-3">
          <div className="pt-1">
            <Checkbox
              checked={task.is_completed}
              onChange={() => onToggle(task.id)}
            />
          </div>

          <div 
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => onTaskClick?.(task.id)}
          >
            <h3
              className={`text-lg font-medium ${
                task.is_completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {task.title}
              {task.is_recurring && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Recurring
                </span>
              )}
            </h3>

            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}

            {task.due_date && (
              <div className="flex items-center mt-2 text-sm">
                <Calendar size={14} className="mr-1" />
                <span className={overdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
                  {formatDate(task.due_date)}
                  {overdue && ' (Overdue)'}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {level < 3 && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowSubtaskForm(true)}
                title="Add subtask"
              >
                <Plus size={16} />
              </Button>
            )}
            <Button
              size="sm"
              variant="danger"
              onClick={() => onDelete(task.id)}
              title="Delete task"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>

      {showSubtaskForm && (
        <div className="mt-2">
          <InlineTaskForm
            parentId={task.id}
            onSubmit={handleAddSubtask}
            onCancel={() => setShowSubtaskForm(false)}
            autoFocus={true}
          />
        </div>
      )}

      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mt-2">
          {task.subtasks.map((subtask) => (
            <TaskItem
              key={subtask.id}
              task={subtask}
              onToggle={onToggle}
              onDelete={onDelete}
              onAddSubtask={onAddSubtask}
              onTaskClick={onTaskClick}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
