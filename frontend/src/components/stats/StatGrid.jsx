import { StatCard } from './StatCard';

export function StatGrid({ stats }) {
  if (!stats || stats.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="font-pixel text-sm text-white">No stats available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}

