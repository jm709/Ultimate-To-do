import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useTrackerStore } from '../../stores/trackerStore';
import { useTaskStore } from '../../stores/taskStore';
import { DayBox } from './DayBox';
import { DayDetailModal } from './DayDetailModal';
import { TaskAssignment } from './TaskAssignment';
import { Modal } from '../common/Modal';
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

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

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
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    clearSelection();
  };

  const handleOpenAssign = async (dayNumber: number) => {
    await selectDay(dayNumber);
    setShowAssignModal(true);
  };

  const handleAssignTask = async (taskId: number, dayNumber: number) => {
    try {
      await assignTask(taskId, dayNumber, 'manual');
      setShowAssignModal(false);
      // Refresh the selected day data if it's still selected
      if (selectedDay === dayNumber) {
        await selectDay(dayNumber);
      }
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
    <div className="max-w-3xl mx-auto p-6">
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
          {/* Week by week layout */}
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

      {selectedDayData && (
        <>
          <DayDetailModal
            isOpen={showDetailModal}
            onClose={handleCloseDetail}
            day={selectedDayData}
            tasks={selectedDayTasks}
            onToggleTask={handleToggleTask}
            onAssignTask={handleOpenAssign}
          />

          <Modal
            isOpen={showAssignModal}
            onClose={() => setShowAssignModal(false)}
            title="Assign Task"
          >
            <TaskAssignment
              tasks={tasks}
              selectedDay={selectedDay}
              onAssign={handleAssignTask}
              onClose={() => setShowAssignModal(false)}
            />
          </Modal>
        </>
      )}

      <div className="mt-6 space-y-4">
        <div className="text-center">
          <Button
            onClick={() => handleOpenAssign(1)}
            size="lg"
            disabled={days.length === 0 || tasks.length === 0}
          >
            <Plus size={20} className="inline mr-2" />
            Assign Task to Any Day
          </Button>
          {tasks.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Create some tasks first before assigning them!
            </p>
          )}
        </div>

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
  );
};
