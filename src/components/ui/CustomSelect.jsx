import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomSelect({ value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === value);

  return (
    <div 
      className="relative w-full" 
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
           setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-11 px-4 w-full bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-border/50 dark:border-white/10 flex items-center justify-between text-left focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all outline-none rounded-xl text-sm font-medium shadow-sm"
      >
        <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-50 top-full left-0 right-0 mt-2 p-1.5 bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl border border-border/50 dark:border-white/10 shadow-2xl rounded-xl max-h-60 overflow-y-auto scrollbar-hide"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${value === option.value ? 'bg-black/5 dark:bg-white/10 text-accent' : 'text-foreground hover:bg-black/5 dark:hover:bg-white/5'}`}
                onClick={(e) => {
                  e.preventDefault();
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
