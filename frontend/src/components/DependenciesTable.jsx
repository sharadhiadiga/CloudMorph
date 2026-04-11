import React from 'react';
import { motion } from 'framer-motion';
import { Box, CheckCircle2, AlertCircle } from 'lucide-react';

const DependenciesTable = ({ dependencies }) => {
  if (!dependencies || dependencies.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-blue/10 rounded-xl">
            <Box className="w-5 h-5 text-accent-blue" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Dependency Analysis</h4>
            <p className="text-[10px] text-slate-500 dark:text-white/40 font-medium uppercase tracking-tighter mt-0.5">
              {dependencies.length} packages identified & audited
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 bg-white/30 dark:bg-white/5 backdrop-blur-xl shadow-xl shadow-blue-500/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-black/5 dark:border-white/10">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/30">Package Name</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/30 text-center">Version</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/30 text-right">Insight</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {dependencies.map((dep, index) => (
              <motion.tr 
                key={dep.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-slate-700 dark:text-white/80 group-hover:text-accent-blue transition-colors">
                    {dep.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-xs font-mono px-2 py-1 bg-black/5 dark:bg-white/10 rounded-lg text-slate-500 dark:text-white/60">
                    {dep.version}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {dep.status === 'upgrade recommended' ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                      <AlertCircle className="w-3 h-3" />
                      Upgrade Suggested
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </div>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DependenciesTable;
