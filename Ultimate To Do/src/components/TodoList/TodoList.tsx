import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import type { CreateTaskInput } from '../../types/task';

export const TodoList: React.FC = () => {
  const { tasks, isLoading, error, fetchTasks, addTask, removeTask, toggleTask } = useTaskStore();
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (task: CreateTaskInput) => {
    await addTask(task);
    setShowTaskForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">To-Do List</h1>
        <Button onClick={() => setShowTaskForm(true)}>
          <Plus size={20} className="inline mr-2" />
          Add Task
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading && tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Loading tasks...</div>
      ) : tasks.length === 0 ? (
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
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        title="Add New Task"
      >
        <TaskForm
          onSubmit={handleAddTask}
          onCancel={() => setShowTaskForm(false)}
        />
      </Modal>
    </div>
  );
};
