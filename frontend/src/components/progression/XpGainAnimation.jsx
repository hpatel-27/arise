// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function XpGainAnimation({ isVisible, xpAmount, statName }) {
  const [position, setPosition] = useState({ top: "50%", left: "50%" });

  useEffect(() => {
    if (isVisible && statName) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        // Find the stat card element by data attribute
        const statCard = document.querySelector(
          `[data-stat-name="${statName}"]`
        );
        if (statCard) {
          const rect = statCard.getBoundingClientRect();
          // Position animation at the center of the stat card
          const top = rect.top + rect.height / 2;
          const left = rect.left + rect.width / 2;
          setPosition({ top: `${top}px`, left: `${left}px` });
        } else {
          // Fallback to center if stat card not found
          setPosition({ top: "50%", left: "50%" });
        }
      });
    }
  }, [isVisible, statName]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={`xp-gain-${xpAmount}-${statName}`}
        initial={{ y: 0, opacity: 0, scale: 0.8 }}
        animate={{ y: -80, opacity: 1, scale: 1 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="fixed z-[9999] pointer-events-none"
        style={{
          top: position.top,
          left: position.left,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.5, repeat: 1 }}
            className="font-pixel text-3xl text-accent"
          >
            +{xpAmount} XP
          </motion.div>
          {/* {statName && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-pixel text-sm text-primary mt-2"
            >
              {statName}
            </motion.div>
          )} */}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
