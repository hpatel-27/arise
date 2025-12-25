import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import { Button } from './Button';

export function Modal({ isOpen, onClose, title, children, className = '' }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              onClick={(e) => e.stopPropagation()}
              className={`max-w-md w-full ${className}`}
            >
              <Card className="relative">
                <div className="flex justify-between items-center mb-4 border-b-4 border-dark pb-2">
                  <h2 className="font-pixel text-sm text-primary">{title}</h2>
                  <Button
                    variant="secondary"
                    onClick={onClose}
                    className="!p-2 !text-xs"
                  >
                    ✕
                  </Button>
                </div>
                {children}
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

