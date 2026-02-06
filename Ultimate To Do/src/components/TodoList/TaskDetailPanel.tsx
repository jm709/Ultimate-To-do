import React, { useState, useEffect } from 'react';
import { X, Trash2, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button';
import type { Task } from '../../types/task';
import { formatDate } from '../../utils/dateHelpers';

interface TaskDetailPanelProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (taskId: number, updates: Partial<Task>) => void;
  onDelete: (taskId: number) => void;
}

export const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState('daily');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(task.due_date || '');
      setIsRecurring(task.is_recurring);
      setRecurrencePattern(task.recurrence_pattern || 'daily');
    }
  }, [task]);

  const handleSave = () => {
    if (!task) return;
    
    onUpdate(task.id, {
      title: title.trim(),
      description: description.trim() || undefined,
      due_date: dueDate || undefined,
      is_recurring: isRecurring,
      recurrence_pattern: isRecurring ? recurrencePattern : undefined,
    });
  };

  const handleDelete = () => {
    if (!task) return;
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };

  if (!task) return null;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 transition-opacity z-40"
          onClick={onClose}
        />
      )}

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSave}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleSave}
                placeholder="Add a description..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="mr-2" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  handleSave();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {task.due_date && (
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(task.due_date)}
                </p>
              )}
            </div>

            {/* Recurring */}
            {!task.parent_id && (
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => {
                      setIsRecurring(e.target.checked);
                      setTimeout(handleSave, 0);
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="flex items-center text-sm font-medium text-gray-700">
                    <RefreshCw size={16} className="mr-2" />
                    Recurring Task
                  </span>
                </label>

                {isRecurring && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recurrence Pattern
                    </label>
                    <select
                      value={recurrencePattern}
                      onChange={(e) => {
                        setRecurrencePattern(e.target.value);
                        handleSave();
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Task Info */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Created: {new Date(task.created_at).toLocaleDateString()}
              </p>
              {task.parent_id && (
                <p className="text-xs text-gray-500 mt-1">
                  This is a subtask
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <Button
              onClick={handleDelete}
              variant="danger"
              className="w-full"
            >
              <Trash2 size={16} className="inline mr-2" />
              Delete Task
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
