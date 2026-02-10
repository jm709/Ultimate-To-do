import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useTrackerStore } from '../../stores/trackerStore';
import { useTaskStore } from '../../stores/taskStore';
import { DayBox } from './DayBox';
import { DayDetailPanel } from './DayDetailPanel';
import { TaskAssignment } from './TaskAssignment';
import { Button } from '../common/Button';

export const Next60Tracker: React.FC = () => {
  const {
    days,
    selectedDay,
    selectedDayTasks,
    isLoading,
    error,
    initializeDays,
    fetchDays,
    assignTask,
    selectDay,
    clearSelection,
  } = useTrackerStore();

  const { tasks, fetchTasks, toggleTask } = useTaskStore();
  const [showTaskAssignment, setShowTaskAssignment] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await initializeDays();
      await fetchDays();
      await fetchTasks();
    };
    initialize();
  }, [initializeDays, fetchDays, fetchTasks]);

  const handleDayClick = async (dayNumber: number) => {
    await selectDay(dayNumber);
    setShowTaskAssignment(false); // Reset assignment view when selecting new day
  };

  const handleAssignTask = async (taskId: number) => {
    if (!selectedDay) return;
    
    try {
      await assignTask(taskId, selectedDay, 'manual');
      setShowTaskAssignment(false);
    } catch (err) {
      console.error('Error assigning task:', err);
    }
  };

  const handleToggleTask = async (taskId: number) => {
    await toggleTask(taskId);
    if (selectedDay) {
      await selectDay(selectedDay);
    }
    await fetchDays();
  };

  const selectedDayData = days.find((d) => d.day_number === selectedDay);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Next 60 Days Tracker</h1>
          <p className="text-gray-600">
            Track your progress over the next 60 days. Assign tasks to specific days and watch
            your progress unfold!
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading && days.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Loading tracker...</div>
        ) : (
          <>
            <div className="space-y-12 mb-6">
              <div className="grid grid-cols-5 gap-1.5 mb-6">
                {days.map((day) => (
                  <DayBox
                    key={day.id}
                    day={day}
                    onClick={() => handleDayClick(day.day_number)}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Legend</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  <span className="text-sm">Future day</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-tracker-red rounded"></div>
                  <span className="text-sm">No tasks completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-tracker-yellow rounded"></div>
                  <span className="text-sm">Less than 50%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-tracker-light-green rounded"></div>
                  <span className="text-sm">50-99% complete</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-tracker-deep-green rounded"></div>
                  <span className="text-sm">100% complete</span>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Day numbers</strong> are shown large for easy reference</li>
              <li>• <strong>Click any day</strong> to view details and mark tasks complete</li>
              <li>• Use <strong>"Assign Task"</strong> button to add tasks to specific days</li>
              <li>• Colors automatically update as you complete tasks</li>
              <li>• Track your progress week by week!</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="col-span-1">
        {selectedDayData && !showTaskAssignment && (
          <DayDetailPanel
            day={selectedDayData}
            tasks={selectedDayTasks}
            onToggleTask={handleToggleTask}
            onShowAssignment={() => setShowTaskAssignment(true)}
          />
        )}
        
        {selectedDayData && showTaskAssignment && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Assign Task to Day {selectedDayData.day_number}
            </h2>
            <TaskAssignment
              tasks={tasks}
              onAssign={handleAssignTask}
              onClose={() => setShowTaskAssignment(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
