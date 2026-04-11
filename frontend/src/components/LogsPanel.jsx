import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, CheckCircle, AlertTriangle, XCircle, Zap, Cpu, HelpCircle, Terminal } from 'lucide-react';

const LOG_TYPES = {
  INFO: {
    icon: Info,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20'
  },
  SUCCESS: {
    icon: CheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20'
  },
  ERROR: {
    icon: XCircle,
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/20'
  },
  WARNING: {
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20'
  },
  SUGGESTION: {
    icon: Zap,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/20'
  },
  TROUBLESHOOTING: {
    icon: HelpCircle,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/20'
  },
  AI: {
    icon: Cpu,
    color: 'text-white',
    bg: 'bg-gradient-to-r from-purple-600/30 to-blue-600/30',
    border: 'border-purple-400/40',
    glow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]'
  }
};

const LogEntry = ({ content }) => {
  // Extract type from string e.g. [INFO] Analysis phase completed
  const match = content.match(/^\[(.*?)\]\s?(.*)$/);
  const type = match ? match[1] : 'INFO';
  const message = match ? match[2] : content;

  const config = LOG_TYPES[type] || LOG_TYPES.INFO;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`flex items-start gap-4 p-4 rounded-xl border ${config.bg} ${config.border} ${config.glow || ''} group transition-all duration-300 hover:scale-[1.01]`}
    >
      <div className={`mt-1 p-1.5 rounded-lg ${config.bg}`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`text-[10px] uppercase font-bold tracking-widest ${config.color} opacity-80`}>
            {type}
          </span>
        </div>
        <p className="text-sm text-slate-700 dark:text-white/90 font-medium leading-relaxed">
          {message}
        </p>
      </div>
    </motion.div>
  );
};

const LogsPanel = ({ logs }) => {
  return (
    <div className="space-y-4 opacity-70 hover:opacity-100 transition-opacity duration-500">
      <div className="flex items-center gap-3 mb-2 px-1">
        <Terminal className="w-4 h-4 text-slate-400" />
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Migration Trace Logs</h3>
      </div>

      <div className="bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col max-h-[400px] shadow-sm transition-all duration-300">
        <div className="p-6 overflow-y-auto space-y-2 scroll-smooth custom-scrollbar bg-white/30 dark:bg-transparent">
          <AnimatePresence mode="popLayout">
            {logs.map((log, index) => (
              <LogEntry key={`${index}-${log}`} content={log} />
            ))}
          </AnimatePresence>
          {logs.length === 0 && (
            <div className="p-12 flex flex-col items-center justify-center text-slate-400 dark:text-white/20 text-sm italic space-y-2">
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-current opacity-20 animate-spin" />
              <span>Awaiting pipeline sequence data...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogsPanel;
