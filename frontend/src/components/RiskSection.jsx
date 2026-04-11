import React from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, AlertTriangle, Info } from 'lucide-react';

const SeverityConfig = {
  HIGH: {
    label: 'HIGH RISK',
    color: 'text-rose-500',
    bg: 'bg-rose-500/5',
    border: 'border-rose-500/30',
    glow: 'shadow-[0_0_20px_rgba(244,63,94,0.15)]',
    icon: AlertOctagon
  },
  MEDIUM: {
    label: 'MEDIUM RISK',
    color: 'text-amber-500',
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/30',
    icon: AlertTriangle
  },
  LOW: {
    label: 'STABLE / LOW',
    color: 'text-slate-400',
    bg: 'bg-slate-500/5',
    border: 'border-slate-500/20',
    icon: Info
  }
};

const RiskItem = ({ risk }) => {
  const severity = risk.includes('HIGH') ? 'HIGH' : risk.includes('MEDIUM') ? 'MEDIUM' : 'LOW';
  const config = SeverityConfig[severity];
  const Icon = config.icon;
  const cleanMessage = risk.replace(/\[RISK_.*?\]/, '').trim();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-5 rounded-2xl border ${config.bg} ${config.border} ${config.glow || ''} flex items-start gap-4 transition-all duration-300 hover:translate-x-1`}
    >
      <div className={`mt-0.5 p-2 rounded-xl ${config.bg} border ${config.border}`}>
        <Icon className={`w-5 h-5 ${config.color}`} />
      </div>
      <div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${config.color} mb-1 block`}>
          {config.label}
        </span>
        <p className="text-slate-700 dark:text-white/90 font-medium leading-relaxed">
          {cleanMessage}
        </p>
      </div>
    </motion.div>
  );
};

const RiskSection = ({ risks }) => {
  if (!risks || risks.length === 0) {
    return (
      <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl p-8 text-center space-y-4">
        <div className="mx-auto w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
           <Info className="w-6 h-6 text-emerald-500" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800 dark:text-white">System Integrity Verified</h4>
          <p className="text-sm text-slate-400 dark:text-white/40">No major risks identified. System appears stable and production-ready.</p>
        </div>
      </div>
    );
  }

  // Sort risks: High > Medium > Low
  const sortedRisks = [...risks].sort((a, b) => {
    const order = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
    const getSev = (r) => r.includes('HIGH') ? 'HIGH' : r.includes('MEDIUM') ? 'MEDIUM' : 'LOW';
    return order[getSev(a)] - order[getSev(b)];
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2 px-1">
        <AlertOctagon className="w-4 h-4 text-slate-400" />
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Risks & Observations</h3>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {sortedRisks.map((risk, idx) => (
          <RiskItem key={idx} risk={risk} />
        ))}
      </div>
    </div>
  );
};

export default RiskSection;
