import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Sparkles } from 'lucide-react';

const ManualActions = ({ actions }) => {
  // Filter out any non-manual logs just in case
  const displayActions = actions && actions.length > 0 ? actions : [];

  if (displayActions.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2 px-1">
          <ClipboardList className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Manual Actions Required</h3>
        </div>
        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 rounded-3xl text-center">
          <p className="text-sm text-slate-400 dark:text-white/20 font-medium">No manual steps required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">AI-Generated Post-Migration Actions</h3>
        </div>
        
        {/* AI Badge with Tooltip */}
        <div className="relative group cursor-help">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-[10px] font-bold text-accent-purple uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            AI Generated
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10 z-50">
            Based on repository analysis and best practices
            <div className="absolute top-full right-4 border-8 border-transparent border-t-slate-900" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {displayActions.map((action, idx) => {
          const cleanAction = action.replace('[MANUAL]', '').trim();
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 hover:border-accent-purple/40 hover:shadow-lg hover:shadow-purple-500/5 cursor-pointer"
            >
              <div className="flex-shrink-0 w-6 h-6 border-2 border-slate-200 dark:border-white/10 rounded-lg flex items-center justify-center group-hover:border-accent-purple transition-colors">
                <div className="w-2.5 h-2.5 bg-accent-purple rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-white/80 leading-relaxed">
                {cleanAction}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ManualActions;
