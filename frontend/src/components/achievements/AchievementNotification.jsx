import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';

export function AchievementNotification({ achievement, isVisible, onClose }) {
  return (
    <AnimatePresence>
      {isVisible && achievement && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <Card className="border-accent border-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{achievement.icon || '🏆'}</div>
              <div className="flex-1">
                <h3 className="font-pixel text-sm text-accent mb-1">
                  Achievement Unlocked!
                </h3>
                <p className="font-pixel text-xs text-white">
                  {achievement.name}
                </p>
              </div>
              <button
                onClick={onClose}
                className="font-pixel text-xs text-white hover:text-accent"
              >
                ✕
              </button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

