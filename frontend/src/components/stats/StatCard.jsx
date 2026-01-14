import { ProgressBar } from "../ui/ProgressBar";
import { StatBadge } from "./StatBadge";

export function StatCard({ stat }) {
  const { category, statLevel, currentXP } = stat;
  const MAX_XP = 1000;
  const xpCurrent = currentXP || 0;

  return (
    <div className="card-pixel" data-stat-name={category}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StatBadge statName={category} size="lg" />
          <h3 className="font-pixel text-sm text-white">{category}</h3>
        </div>
        <div className="text-right">
          <div className="font-pixel text-xs text-accent">Lv. {statLevel}</div>
        </div>
      </div>
      <ProgressBar current={xpCurrent} max={MAX_XP} showNumbers={true} />
    </div>
  );
}
