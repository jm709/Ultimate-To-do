import React, { useEffect, useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';
import { TaskItem } from './TaskItem';
import { InlineTaskForm } from './InlineTaskForm';
import { TaskDetailPanel } from './TaskDetailPanel';
import { Button } from '../common/Button';
import type { CreateTaskInput, Task } from '../../types/task';

export const TodoList: React.FC = () => {
  const { tasks, isLoading, error, fetchTasks, addTask, removeTask, toggleTask, editTask } = useTaskStore();
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (task: CreateTaskInput) => {
    await addTask(task);
    setShowInlineForm(false);
  };

  // Find the selected task recursively
  const findTaskById = (taskList: Task[], id: number): Task | null => {
    for (const task of taskList) {
      if (task.id === id) return task;
      if (task.subtasks && task.subtasks.length > 0) {
        const found = findTaskById(task.subtasks, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedTask = useMemo(() => {
    if (selectedTaskId === null) return null;
    return findTaskById(tasks, selectedTaskId);
  }, [tasks, selectedTaskId]);

  const handleTaskClick = (taskId: number) => {
    setSelectedTaskId(taskId);
  };

  const handleUpdateTask = async (taskId: number, updates: Partial<Task>) => {
    await editTask({
      id: taskId,
      title: updates.title,
      description: updates.description,
      due_date: updates.due_date,
      is_recurring: updates.is_recurring,
      recurrence_pattern: updates.recurrence_pattern,
    });
  };

  const handleDeleteTask = async (taskId: number) => {
    await removeTask(taskId);
    setSelectedTaskId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2">
          <div className={`flex-1 transition-all duration-300 ${selectedTaskId ? 'mr-96' : ''}`}>
            <div className="max-w-4xl mx-auto p-10">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">To-Do List</h1>
                <Button onClick={() => setShowInlineForm(!showInlineForm)}>
                  <Plus size={20} className="inline mr-2" />
                  Add Task
                </Button>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {showInlineForm && (
                <div className="mb-4">
                  <InlineTaskForm
                    onSubmit={handleAddTask}
                    onCancel={() => setShowInlineForm(false)}
                  />
                </div>
              )}

              {isLoading && tasks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Loading tasks...</div>
              ) : tasks.length === 0 && !showInlineForm ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-xl mb-4">No tasks yet!</p>
                  <p>Click "Add Task" to create your first task.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onDelete={removeTask}
                      onAddSubtask={addTask}
                      onTaskClick={handleTaskClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-1">
        <TaskDetailPanel
            task={selectedTask}
            isOpen={selectedTaskId !== null}
            onClose={() => setSelectedTaskId(null)}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        </div>
      </div>
    </div>
  );
};
