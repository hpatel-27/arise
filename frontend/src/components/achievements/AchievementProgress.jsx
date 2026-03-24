import { ProgressBar } from "../ui/ProgressBar";

export function AchievementProgress({ achievement, currentProgress = 0 }) {
  if (!achievement.targetValue || achievement.targetValue <= 1) {
    return null;
  }

  return (
    <div className="mt-2">
      <ProgressBar
        current={currentProgress}
        max={achievement.targetValue}
        label={achievement.name}
        showNumbers={true}
      />
    </div>
  );
}
