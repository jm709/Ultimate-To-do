import React, { useState, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import type { CreateTaskInput } from '../../types/task';

interface InlineTaskFormProps {
  onSubmit: (task: CreateTaskInput) => void;
  onCancel: () => void;
  parentId?: number;
  autoFocus?: boolean;
}

export const InlineTaskForm: React.FC<InlineTaskFormProps> = ({
  onSubmit,
  onCancel,
  parentId,
  autoFocus = true,
}) => {
  const [title, setTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState('daily');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      due_date: dueDate || undefined,
      is_recurring: isRecurring,
      recurrence_pattern: isRecurring ? recurrencePattern : undefined,
      parent_id: parentId,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setDueDate('');
    setIsRecurring(false);
    setRecurrencePattern('daily');
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isExpanded) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <div ref={formRef} className="bg-white border-2 border-blue-500 rounded-lg p-3 shadow-lg">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsExpanded(true)}
            placeholder={parentId ? "Add a subtask..." : "Add a task..."}
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!title.trim()}
            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            title="Save (Enter)"
          >
            <Check size={20} />
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            title="Cancel (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {isExpanded && (
          <div className="mt-3 space-y-3 pt-3 border-t border-gray-200">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details..."
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {!parentId && (
              <>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Recurring Task</span>
                </label>

                {isRecurring && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Repeat
                    </label>
                    <select
                      value={recurrencePattern}
                      onChange={(e) => setRecurrencePattern(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </form>
    </div>
  );
};
