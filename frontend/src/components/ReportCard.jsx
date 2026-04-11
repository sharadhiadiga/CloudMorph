import React from 'react';
import { motion } from 'framer-motion';
import { Box, Rocket, Globe, Database, Server } from 'lucide-react';

const ReportCard = ({ type, data }) => {
  if (type === 'app') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-xl shadow-purple-500/5 transition-all duration-300 flex-1 min-w-[300px]"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-accent-purple/10 dark:bg-accent-purple/20 rounded-xl">
            <Box className="w-6 h-6 text-accent-purple" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-white/50 uppercase tracking-widest">Application Info</h3>
            <p className="text-xl font-bold bg-clip-text text-transparent bg-neon-gradient">
              {data.app_name || 'N/A'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 dark:text-white/40">Technology Stack</span>
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-accent-cyan" />
              <span className="font-medium text-slate-700 dark:text-white/90 capitalize">{data.stack}</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400 dark:text-white/40">Container Port</span>
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4 text-accent-cyan" />
              <span className="font-medium text-slate-700 dark:text-white/90">{data.port || '0'}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-xl shadow-purple-500/5 transition-all duration-300 flex-[1.5] min-w-[350px]"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="p-3 bg-accent-blue/10 dark:bg-accent-blue/20 rounded-xl">
          <Rocket className="w-6 h-6 text-accent-blue" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-500 dark:text-white/50 uppercase tracking-widest">Deployment Status</h3>
          <p className="text-xl font-bold text-slate-700 dark:text-white/90">
            {data.deployment_url ? 'Deployment Ready' : 'Provisioning Failed'}
          </p>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        {data.deployment_url && (
          <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/10 hover:border-accent-cyan/50 transition-colors group">
            <span className="text-xs text-slate-400 dark:text-white/40 block mb-1">Live Endpoint</span>
            <a href={data.deployment_url} target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-accent-cyan group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium truncate">{data.deployment_url}</span>
            </a>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/10">
            <span className="text-xs text-slate-400 dark:text-white/40 block mb-1">Image Registry</span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-white/60 truncate block">{data.image_name}</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/10">
            <span className="text-xs text-slate-400 dark:text-white/40 block mb-1">Compute Framework</span>
            <span className="text-xs font-medium text-slate-700 dark:text-white/80">Terraform Cloud</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportCard;
