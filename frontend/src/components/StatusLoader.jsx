import React from 'react';
import { motion } from 'framer-motion';

const StatusLoader = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6">
      <div className="relative w-24 h-24">
        {/* Pulsing Outer Ring */}
        <motion.div 
          className="absolute inset-0 border-4 border-accent-purple/30 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Spinning Inner Ring */}
        <motion.div 
          className="absolute inset-0 border-t-4 border-accent-cyan rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <motion.p 
        className="text-xl font-medium text-slate-700 dark:text-white/80 animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {text || "Processing Migration Components..."}
      </motion.p>
    </div>
  );
};

export default StatusLoader;
