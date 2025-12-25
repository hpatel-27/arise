import { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { AchievementModal } from "../components/achievements/AchievementModal";
import { AchievementCard } from "../components/achievements/AchievementCard";
import { Button } from "../components/ui/Button";
import { useAchievements } from "../hooks/useAchievements";

export default function Achievements() {
  const { achievements, loading } = useAchievements();
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="font-pixel text-2xl text-primary">Achievements</h1>
          <Button variant="accent" onClick={() => setShowModal(true)}>
            View All
          </Button>
        </div>

        <div className="card-pixel mb-6">
          <p className="font-pixel text-sm text-white">
            Progress: {unlockedCount} / {totalCount} unlocked
          </p>
        </div>

        {loading ? (
          <p className="font-pixel text-sm text-white">
            Loading achievements...
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={achievement.unlocked}
              />
            ))}
          </div>
        )}
      </div>

      <AchievementModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        achievements={achievements}
      />
    </AppShell>
  );
}
