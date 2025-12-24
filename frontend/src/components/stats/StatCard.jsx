import { ProgressBar } from '../ui/ProgressBar';
import { StatBadge } from './StatBadge';

export function StatCard({ stat }) {
  const { category, level, xp, xpToNextLevel } = stat;
  const xpMax = xpToNextLevel || 1000;
  const xpCurrent = xp || 0;

  return (
    <div className="card-pixel">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StatBadge statName={category.name} size="lg" />
          <h3 className="font-pixel text-sm text-white">{category.name}</h3>
        </div>
        <div className="text-right">
          <div className="font-pixel text-xs text-accent">Lv. {level}</div>
        </div>
      </div>
      <ProgressBar
        current={xpCurrent}
        max={xpMax}
        showNumbers={true}
      />
    </div>
  );
}

