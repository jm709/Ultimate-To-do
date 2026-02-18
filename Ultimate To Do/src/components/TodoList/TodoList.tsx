import React, { useEffect, useState, useMemo } from 'react';
import { Plus, ChevronRight, ChevronDown } from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';
import { TaskItem } from './TaskItem';
import { InlineTaskForm } from './InlineTaskForm';
import { TaskDetailPanel } from './TaskDetailPanel';
import { Button } from '../common/Button';
import type { CreateTaskInput, Task } from '../../types/task';

function CollapsibleSection({ title, count, children, open }: { title: string, count: number, children: React.ReactNode, open: boolean }) {
  const [isOpen, setIsOpen] = useState(open);
  return <div>
    <button className="flex items-center gap-2 font-semibold text-sm text-green-500" onClick={() => setIsOpen(!isOpen)}>
      {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      {title} ({count})
    </button>
    {isOpen && <div className="mt-2 space-y-2">{children}</div>} 
  </div>;
}

export const TodoList: React.FC = () => {
  const { tasks, isLoading, error, fetchTasks, addTask, removeTask, toggleTask, editTask } = useTaskStore();
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const [collapsedIds, setCollapsedIds] = useState<Set<number>>(() => {
    const saved = localStorage.getItem('collapsedIds');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem(
      'collapsedIds', 
      JSON.stringify(Array.from(collapsedIds))
    );
  }, [collapsedIds]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleCollapse = (taskId: number) => {
    setCollapsedIds(prev => {
      const next = new Set(prev);
      next.has(taskId) ? next.delete(taskId) : next.add(taskId);
      return next;
    });
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

  const splitTasks = useMemo(() => {
    const completedTasks: Task[] = [];
    const incompleteTasks: Task[] = [];
    for (const task of tasks) {
      if (!task.parent_id) {
        if (task.is_completed) {
          completedTasks.push(task);
        } else {
          incompleteTasks.push(task);
        }
      } 
    }
    return { completedTasks, incompleteTasks };
  }, [tasks]);
  

  const handleAddTask = async (task: CreateTaskInput) => {
    await addTask(task);
    setShowInlineForm(false);
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
    <div className="min-h-screen bg-[#050505] py-8">
      <div style={{ marginLeft: '8px'}}>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <div className="max-w-4xl mx-auto p-10">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-orange-500">To-Do List</h1>
                <Button onClick={() => setShowInlineForm(!showInlineForm)} size="md">
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
                  <CollapsibleSection title="Incomplete Tasks" count={splitTasks.incompleteTasks.length} open={true}>
                    {splitTasks.incompleteTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onDelete={removeTask}
                        onAddSubtask={addTask}
                        onTaskClick={handleTaskClick}
                        collapsedIds={collapsedIds}
                        onToggleCollapse={toggleCollapse}
                      />
                    ))}
                  </CollapsibleSection>
                  <CollapsibleSection title="Completed Tasks" count={splitTasks.completedTasks.length} open={false}>
                    {splitTasks.completedTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onDelete={removeTask}
                        onAddSubtask={addTask}
                        onTaskClick={handleTaskClick}
                        collapsedIds={collapsedIds}
                        onToggleCollapse={toggleCollapse}
                      />
                    ))}
                  </CollapsibleSection>
                </div>
              )}
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
    </div>
  );
};
