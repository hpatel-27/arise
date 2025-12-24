import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { StatBadge } from '../stats/StatBadge';

export function TaskCard({ task, onAssign, onComplete, isAssigned = false, isCompleted = false }) {
  const handleAction = () => {
    if (isAssigned && !isCompleted) {
      onComplete?.(task.id);
    } else if (!isAssigned) {
      onAssign?.(task.id);
    }
  };

  return (
    <Card>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {task.category && (
            <StatBadge statName={task.category.name} size="md" />
          )}
          <h3 className="font-pixel text-sm text-white">{task.name}</h3>
        </div>
        {task.xpValue && (
          <span className="font-pixel text-xs text-accent">+{task.xpValue} XP</span>
        )}
      </div>
      
      {task.description && (
        <p className="text-white text-sm mb-3 opacity-80">{task.description}</p>
      )}

      <div className="flex gap-2">
        {isAssigned && !isCompleted ? (
          <Button variant="primary" onClick={handleAction} className="flex-1">
            Complete
          </Button>
        ) : !isAssigned ? (
          <Button variant="accent" onClick={handleAction} className="flex-1">
            Assign
          </Button>
        ) : (
          <div className="font-pixel text-xs text-primary w-full text-center py-2">
            Completed ✓
          </div>
        )}
      </div>
    </Card>
  );
}

