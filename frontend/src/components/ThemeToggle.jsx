import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <div className="fixed top-6 right-6 z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsDark(!isDark)}
        className="relative flex items-center w-16 h-8 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-full border border-dark:border-white/10 border-black/5 shadow-lg cursor-pointer p-1 overflow-hidden"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <motion.div
          animate={{
            x: isDark ? 32 : 0,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-6 h-6 bg-accent-purple rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.5)]"
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div
                key="moon"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-4 h-4 text-white" fill="white" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        <div className="absolute inset-0 flex justify-between px-2 items-center pointer-events-none opacity-30">
          <Moon className="w-3 h-3 text-[#111] dark:text-white" />
          <Sun className="w-3 h-3 text-[#111] dark:text-white" />
        </div>
      </motion.button>
    </div>
  );
};

export default ThemeToggle;
