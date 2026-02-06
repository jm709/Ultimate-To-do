import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Checkbox } from '../common/Checkbox';
import type { CreateTaskInput } from '../../types/task';

interface TaskFormProps {
  parentId?: number;
  onSubmit: (task: CreateTaskInput) => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ parentId, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState('daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    onSubmit({
      title,
      description: description || undefined,
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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task description"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {!parentId && (
        <>
          <Checkbox
            checked={isRecurring}
            onChange={setIsRecurring}
            label="Recurring Task"
          />

          {isRecurring && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recurrence Pattern
              </label>
              <select
                value={recurrencePattern}
                onChange={(e) => setRecurrencePattern(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          )}
        </>
      )}

      <div className="flex space-x-2">
        <Button type="submit" variant="primary">
          {parentId ? 'Add Subtask' : 'Add Task'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
