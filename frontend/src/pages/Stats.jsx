import { AppShell } from "../components/layout/AppShell";
import { StatGrid } from "../components/stats/StatGrid";
import { useStats } from "../hooks/useStats";

export default function Stats() {
  const { stats, loading, error } = useStats();

  return (
    <AppShell>
      <div className="space-y-6">
        <h1 className="font-pixel text-2xl text-primary">Stats</h1>

        {error && (
          <div className="card-pixel border-secondary">
            <p className="font-pixel text-sm text-secondary">Error: {error}</p>
          </div>
        )}

        {loading ? (
          <p className="font-pixel text-sm text-white">Loading stats...</p>
        ) : (
          <StatGrid stats={stats} />
        )}
      </div>
    </AppShell>
  );
}
