import { useState } from 'react';
import { TaskCard } from './TaskCard';
import { Input } from '../ui/Input';
import { StatBadge } from '../stats/StatBadge';

export function TaskList({ 
  tasks, 
  userTasks = [], 
  onAssign, 
  onComplete,
  loading = false 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStat, setFilterStat] = useState('all');

  const statNames = ['Strength', 'Intelligence', 'Vitality', 'Agility', 'Perception'];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStat = filterStat === 'all' || 
                        (task.category && task.category.name === filterStat);
    return matchesSearch && matchesStat;
  });

  const getUserTaskStatus = (taskId) => {
    const userTask = userTasks.find(ut => ut.taskId === taskId);
    return {
      isAssigned: !!userTask,
      isCompleted: userTask?.completed || false
    };
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="font-pixel text-sm text-white">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 space-y-3">
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStat('all')}
            className={`px-3 py-1 border-4 font-pixel text-xs ${
              filterStat === 'all'
                ? 'bg-primary border-dark text-background'
                : 'bg-background border-dark text-white'
            }`}
          >
            All
          </button>
          {statNames.map(stat => (
            <button
              key={stat}
              onClick={() => setFilterStat(stat)}
              className={`px-3 py-1 border-4 font-pixel text-xs flex items-center gap-1 ${
                filterStat === stat
                  ? 'bg-primary border-dark text-background'
                  : 'bg-background border-dark text-white'
              }`}
            >
              <StatBadge statName={stat} size="sm" />
              {stat}
            </button>
          ))}
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="font-pixel text-sm text-white">No tasks found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => {
            const { isAssigned, isCompleted } = getUserTaskStatus(task.id);
            return (
              <TaskCard
                key={task.id}
                task={task}
                onAssign={onAssign}
                onComplete={onComplete}
                isAssigned={isAssigned}
                isCompleted={isCompleted}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

