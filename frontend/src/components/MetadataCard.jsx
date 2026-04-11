import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Database, Hash, FileCode, Server, Terminal } from 'lucide-react';

const MetadataField = ({ label, value, icon: Icon }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col space-y-2 p-3 bg-slate-100/50 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 group relative transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400 dark:text-white/40 uppercase tracking-tighter text-[10px] font-bold">
          <Icon className="w-3 h-3" />
          {label}
        </div>
        <button
          onClick={handleCopy}
          className="p-1 px-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-slate-300 dark:text-white/30 hover:text-accent-cyan"
          title={value}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex items-center gap-1"
              >
                <Check className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold">Copied!</span>
              </motion.div>
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </AnimatePresence>
        </button>
      </div>
      <div className="text-sm font-medium text-slate-700 dark:text-white/80 pr-2 truncate" title={value}>
        {value || 'N/A'}
      </div>
    </div>
  );
};

const MetadataCard = ({ data }) => {
  const appId = useMemo(() => {
    const timestamp = new Date().getTime().toString().slice(-6);
    return `${data.app_name || 'app'}-${timestamp}`;
  }, [data.app_name]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-xl shadow-purple-500/5 transition-colors duration-300"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-accent-blue/10 dark:bg-accent-blue/20 rounded-lg">
          <Terminal className="w-5 h-5 text-accent-blue" />
        </div>
        <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-widest">Application Metadata</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetadataField label="App ID" value={appId} icon={Hash} />
        <MetadataField label="App Name" value={data.app_name} icon={FileCode} />
        <MetadataField label="Stack" value={data.stack} icon={Database} />
        <MetadataField label="Container Port" value={data.port?.toString()} icon={Server} />
        <div className="md:col-span-2">
          <MetadataField label="Source Path" value={data.source_path} icon={FileCode} />
        </div>
      </div>
    </motion.div>
  );
};

export default MetadataCard;
