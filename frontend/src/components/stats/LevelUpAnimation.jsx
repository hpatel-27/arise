import { motion, AnimatePresence } from 'framer-motion';

export function LevelUpAnimation({ isVisible, statName, newLevel }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ 
            duration: 0.3,
            ease: [0.34, 1.56, 0.64, 1]
          }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 0.5,
                repeat: 2
              }}
              className="font-pixel text-4xl text-accent mb-4"
            >
              LEVEL UP!
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-pixel text-2xl text-primary"
            >
              {statName} → Level {newLevel}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

