import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, RefreshCw, Plus, Check, Cloud } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const configs = {
    upgraded: { 
      label: 'Upgraded', 
      icon: RefreshCw, 
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' 
    },
    added: { 
      label: 'Added', 
      icon: Plus, 
      color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' 
    },
    completed: { 
      label: 'Completed', 
      icon: Check, 
      color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
    },
    deployed: { 
      label: 'Deployed', 
      icon: Cloud, 
      color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' 
    },
    pending: { 
      label: 'Pending', 
      icon: Zap, 
      color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' 
    }
  };

  const config = configs[status] || configs.pending;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </div>
  );
};

const MigrationDelta = ({ summary }) => {
  if (!summary || summary.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <div className="p-2 bg-accent-purple/10 rounded-xl">
          <Zap className="w-5 h-5 text-accent-purple" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Transformation Roadmap</h4>
          <p className="text-[10px] text-slate-500 dark:text-white/40 font-medium uppercase tracking-tighter mt-0.5">
            Modernization delta: Initial State vs Target Architecture
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {summary.map((item, index) => (
          <motion.div 
            key={item.component}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl border border-black/5 dark:border-white/10 bg-white/30 dark:bg-white/5 backdrop-blur-xl hover:border-accent-purple/30 transition-all duration-500 shadow-xl shadow-purple-500/5"
          >
            {/* Component Header */}
            <div className="md:w-1/4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/30 block mb-1">Architecture Tier</span>
              <h5 className="text-sm font-black text-slate-900 dark:text-white truncate">{item.component}</h5>
            </div>

            {/* From -> To Transformation */}
            <div className="flex-1 flex items-center justify-center gap-4 md:gap-8 bg-black/5 dark:bg-black/20 p-4 rounded-2xl border border-black/5 dark:border-white/5">
              <div className="text-center flex-1">
                <span className="text-[9px] font-bold text-slate-400 dark:text-white/20 uppercase block mb-1">Baseline</span>
                <p className="text-xs font-bold text-slate-500 dark:text-white/40">{item.from}</p>
              </div>
              
              <div className="p-2 bg-accent-purple/20 rounded-full animate-pulse">
                <ArrowRight className="w-4 h-4 text-accent-purple" />
              </div>

              <div className="text-center flex-1">
                <span className="text-[9px] font-bold text-accent-cyan uppercase block mb-1">Optimized</span>
                <p className="text-xs font-black text-slate-900 dark:text-white">{item.to}</p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="md:w-1/4 flex justify-end">
              <StatusBadge status={item.status} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MigrationDelta;
