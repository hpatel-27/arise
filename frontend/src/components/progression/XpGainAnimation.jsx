import { motion, AnimatePresence } from 'framer-motion';

export function XpGainAnimation({ isVisible, xpAmount, statName }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0, opacity: 1, scale: 1 }}
          animate={{ y: -50, opacity: 0, scale: 1.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.5, repeat: 1 }}
              className="font-pixel text-3xl text-accent"
            >
              +{xpAmount} XP
            </motion.div>
            {statName && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-pixel text-sm text-primary mt-2"
              >
                {statName}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

