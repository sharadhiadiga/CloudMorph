import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const SummaryCard = ({ content }) => {
  if (!content) return null;

  // Clean the tag
  const cleanContent = content.replace('[SUMMARY]', '').trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-0.5 rounded-3xl bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 shadow-[0_0_30px_rgba(168,85,247,0.2)] group overflow-hidden"
    >
      {/* Dynamic Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
      
      <div className="bg-white dark:bg-[#05070a] rounded-[22px] p-8 md:p-10 relative z-10 transition-colors duration-300">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-accent-purple/10 rounded-2xl">
            <Zap className="w-6 h-6 text-accent-purple" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-accent-purple uppercase tracking-[0.3em]">Executive Summary</h4>
            <div className="h-1 w-12 bg-accent-purple rounded-full" />
          </div>
        </div>
        
        <p className="text-slate-700 dark:text-white/90 text-lg md:text-xl font-medium leading-relaxed italic">
          "{cleanContent}"
        </p>
      </div>
    </motion.div>
  );
};

export default SummaryCard;
