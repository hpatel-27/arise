import { Modal } from "../ui/Modal";
import { AchievementCard } from "./AchievementCard";

export function AchievementModal({ isOpen, onClose, achievements = [] }) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Achievements"
      className="max-w-4xl"
    >
      <div className="mb-4">
        <p className="font-pixel text-xs text-white">
          Progress: {unlockedCount} / {totalCount} unlocked
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {achievements.length === 0 ? (
          <p className="font-pixel text-sm text-white col-span-2 text-center py-8">
            No achievements available
          </p>
        ) : (
          achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              unlocked={achievement.unlocked}
            />
          ))
        )}
      </div>
    </Modal>
  );
}
