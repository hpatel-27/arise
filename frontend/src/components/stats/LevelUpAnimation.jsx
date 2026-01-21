// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { StatBadge } from "./StatBadge";

export function LevelUpAnimation({ isVisible, statName, newLevel }) {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={`level-up-${statName}-${newLevel}`}
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: 50 }}
        transition={{
          duration: 0.4,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] pointer-events-none"
      >
        <div className="card-pixel border-accent border-4 min-w-[300px]">
          <div className="text-center">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: 2,
              }}
              className="font-pixel text-3xl text-accent mb-3"
            >
              LEVEL UP!
            </motion.div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <StatBadge statName={statName} size="lg" />
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-pixel text-xl text-primary"
              >
                Level {newLevel}
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-pixel text-sm text-white opacity-80"
            >
              {statName} has increased!
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
