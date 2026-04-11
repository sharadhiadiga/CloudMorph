import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, CheckCircle2 } from 'lucide-react';

const ManualActions = ({ actions }) => {
  // If no manual actions, show standard best practices as requested
  const displayActions = (actions && actions.length > 0) ? actions : [
    "[MANUAL] Implement environment-specific secrets management.",
    "[MANUAL] Configure automated health monitoring and alerts.",
    "[MANUAL] Integrate CI/CD security scanning tools."
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2 px-1">
        <ClipboardList className="w-4 h-4 text-slate-400" />
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Manual Actions Required</h3>
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
              className="group bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 hover:border-accent-cyan/40 hover:shadow-lg hover:shadow-cyan-500/5 cursor-pointer"
            >
              <div className="flex-shrink-0 w-6 h-6 border-2 border-slate-200 dark:border-white/10 rounded-lg flex items-center justify-center group-hover:border-accent-cyan transition-colors">
                <div className="w-2.5 h-2.5 bg-accent-cyan rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" />
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
