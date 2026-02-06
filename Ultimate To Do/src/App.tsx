import { useState } from 'react';
import { CheckSquare, Calendar, Clock } from 'lucide-react';
import { TodoList } from './components/TodoList/TodoList';
import { Next60Tracker } from './components/Next60Tracker/Next60Tracker';
import { PomodoroTimer } from './components/PomodoroTimer/PomodoroTimer';

type Tab = 'tasks' | 'tracker' | 'pomodoro';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('tasks');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Ultimate To-Do</h1>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('tasks')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'tasks'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CheckSquare size={20} />
                <span>Tasks</span>
              </button>
              
              <button
                onClick={() => setActiveTab('tracker')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'tracker'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Calendar size={20} />
                <span>Next 60</span>
              </button>
              
              <button
                onClick={() => setActiveTab('pomodoro')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'pomodoro'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Clock size={20} />
                <span>Pomodoro</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6">
        {activeTab === 'tasks' && <TodoList />}
        {activeTab === 'tracker' && <Next60Tracker />}
        {activeTab === 'pomodoro' && <PomodoroTimer />}
      </main>
    </div>
  );
}

export default App;
