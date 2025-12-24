import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

export function AchievementCard({ achievement, unlocked = false, progress = null }) {
  const isUnlocked = unlocked || (achievement.unlocked || false);
  const hasProgress = progress !== null && achievement.targetValue > 1;

  return (
    <Card className={isUnlocked ? 'border-accent' : 'opacity-60'}>
      <div className="flex items-start gap-3">
        <div className="text-4xl flex-shrink-0">
          {isUnlocked ? achievement.icon || '🏆' : '🔒'}
        </div>
        <div className="flex-1">
          <h3 className={`font-pixel text-sm mb-1 ${isUnlocked ? 'text-accent' : 'text-white'}`}>
            {achievement.name}
          </h3>
          <p className="text-white text-xs opacity-80 mb-2">
            {achievement.description}
          </p>
          {hasProgress && (
            <ProgressBar
              current={progress || 0}
              max={achievement.targetValue}
              showNumbers={true}
            />
          )}
          {isUnlocked && (
            <div className="mt-2 font-pixel text-xs text-accent">
              Unlocked! ✓
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

