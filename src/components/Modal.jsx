import { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ open, isOpen, onClose, title, children, footer, size = 'md' }) {
  const visible = open ?? isOpen;
  const sizeClass = size === 'lg' ? 'max-w-2xl' : 'max-w-xl';

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          key="modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close modal"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className={`relative z-10 w-full ${sizeClass} bg-card/90 backdrop-blur-xl border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {title && (
              <div className="flex items-center justify-between gap-6 border-b border-border/50 px-8 py-5 shrink-0">
                <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" 
                  aria-label="Close"
                >
                  <X size={18} strokeWidth={2} />
                </button>
              </div>
            )}
            {!title && (
              <button 
                type="button" 
                onClick={onClose} 
                className="absolute right-6 top-6 z-20 w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" 
                aria-label="Close"
              >
                <X size={18} strokeWidth={2} />
              </button>
            )}
            <div className="p-8 overflow-y-auto">
              {children}
            </div>
            {footer && (
              <div className="border-t border-border/50 px-8 py-5 bg-secondary/30 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
