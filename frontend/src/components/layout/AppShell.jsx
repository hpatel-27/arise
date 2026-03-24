import { PixelArtNav } from './PixelArtNav';
import { AchievementNotification } from '../achievements/AchievementNotification';
import { useAuth } from '../../hooks/useAuth';

export function AppShell({ children }) {
  const { currentAchievement, achievementVisible, dismissAchievement } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <PixelArtNav />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <AchievementNotification
        achievement={currentAchievement}
        isVisible={achievementVisible}
        onClose={dismissAchievement}
      />
    </div>
  );
}

