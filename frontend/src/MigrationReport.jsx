import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Send, Cpu } from 'lucide-react';
import ReportCard from './components/ReportCard';
import LogsPanel from './components/LogsPanel';
import MetadataCard from './components/MetadataCard';
import ExportButtons from './components/ExportButtons';
import ThemeToggle from './components/ThemeToggle';
import SummaryCard from './components/SummaryCard';
import RiskSection from './components/RiskSection';
import ManualActions from './components/ManualActions';
import StatusFlow from './components/StatusFlow';
import DependenciesTable from './components/DependenciesTable';
import MigrationDelta from './components/MigrationDelta';

const STAGE_TIMINGS = [
  { duration: 1200 }, // Initializing
  { duration: 2000 }, // Analyzing
  { duration: 1800 }, // Docker Config
  { duration: 3200 }, // Building
  { duration: 2800 }, // Provisioning
  { duration: 3800 }, // Deploying
  { duration: 1500 }  // Finalizing
];

const MigrationReport = () => {
  const [migrationStatus, setMigrationStatus] = useState('idle'); // idle | running | completed
  const [data, setData] = useState(null);
  const [repoUrl, setRepoUrl] = useState('https://github.com/example/inventory-api');
  
  // Display State (pacing)
  const [displayLogs, setDisplayLogs] = useState([]);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  
  // Internal Buffers
  const logBuffer = useRef([]);
  const backendResult = useRef(null);
  const reportRef = useRef(null);

  // Buffer draining effect: Pulls logs one by one for "typing" feel
  useEffect(() => {
    if (migrationStatus === 'running') {
      const interval = setInterval(() => {
        if (logBuffer.current.length > 0) {
          const nextLog = logBuffer.current.shift();
          setDisplayLogs(prev => [...prev, nextLog]);
        }
      }, 450); // Log appearance speed
      return () => clearInterval(interval);
    }
  }, [migrationStatus]);

  const runMigration = async () => {
    // 1. Reset State
    setMigrationStatus('running');
    setData(null);
    setDisplayLogs([]);
    setDisplayProgress(0);
    setCurrentStageIndex(0);
    logBuffer.current = [];
    backendResult.current = null;

    // 2. Start Backend Fetch (Parallel)
    const fetchPromise = (async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repo_url: repoUrl })
        });

        if (!response.body) return;
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop();

          for (const line of lines) {
            if (line.trim()) {
              const chunk = JSON.parse(line);
              // Store new logs in buffer
              const newLogs = chunk.logs.filter(l => !logBuffer.current.includes(l) && !displayLogs.includes(l));
              logBuffer.current = [...logBuffer.current, ...newLogs];
              
              if (chunk.status === 'completed' && chunk.data) {
                backendResult.current = chunk.data;
              }
            }
          }
        }
      } catch (err) {
        console.error("Backend Error:", err);
      }
    })();

    // 3. Orchestrate UI Pacing (Primary Controller)
    for (let i = 0; i < STAGE_TIMINGS.length; i++) {
      setCurrentStageIndex(i);
      
      const timing = STAGE_TIMINGS[i];
      const randomExtra = Math.random() * 800;
      const stepDuration = (timing.duration + randomExtra) / 10;
      
      // Gradually move progress bar within the stage range
      // Stages are roughly indexed at 0, 15, 30, 45, 65, 85, 100
      const startProgress = i === 0 ? 0 : [5, 15, 30, 45, 65, 85][i-1] || 0;
      const targetProgress = [5, 15, 30, 45, 65, 85, 100][i];
      
      for (let p = 0; p <= 10; p++) {
        const subProgress = startProgress + ((targetProgress - startProgress) * (p / 10));
        setDisplayProgress(subProgress);
        await new Promise(r => setTimeout(r, stepDuration));
      }
    }

    // 4. Finalize
    await new Promise(r => setTimeout(r, 1000)); // Build final anticipation
    await fetchPromise; // Ensure backend data is ready
    
    if (backendResult.current) {
      setData(backendResult.current);
      setMigrationStatus('completed');
    } else {
      setMigrationStatus('idle');
    }
  };

  const loading = migrationStatus === 'running';

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B0F19] text-[#111] dark:text-gray-100 transition-colors duration-300 relative overflow-hidden font-outfit">
      <ThemeToggle />
      
      {/* Background Glows */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.07, 0.03] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="fixed inset-0 bg-accent-purple blur-[180px] rounded-full pointer-events-none opacity-5 -top-1/2 -left-1/4 w-full h-full" 
      />
      
      <div className="max-w-7xl mx-auto space-y-12 relative z-10 px-6 py-12">
        <header className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left space-y-2">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 justify-center md:justify-start"
            >
              <Cpu className="w-5 h-5 text-accent-cyan" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent-cyan">Intelligence Phase</span>
            </motion.div>
            <motion.h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
              CloudMorph
            </motion.h1>
            <p className="text-slate-600 dark:text-white/40 text-lg font-medium">Automated Enterprise Cloud Migration</p>
          </div>

          <div className="flex flex-col items-end gap-4 w-full md:w-auto">
            <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-2 rounded-2xl flex items-center gap-2 w-full md:w-auto shadow-2xl shadow-purple-500/5">
              <input 
                type="text" 
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                disabled={loading}
                placeholder="Repository URL"
                className="bg-transparent border-none outline-none text-slate-900 dark:text-white/80 px-4 py-2 text-sm w-full lg:w-96 placeholder:text-slate-400 disabled:opacity-50"
              />
              <button 
                onClick={runMigration}
                disabled={loading}
                className="bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 active:scale-95"
              >
                {loading ? 'Processing...' : 'Start Migration'}
                {!loading && <Send className="w-4 h-4" />}
              </button>
            </div>
            
            <AnimatePresence>
              {data && !loading && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <ExportButtons data={data} reportRef={reportRef} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <main className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {migrationStatus === 'running' && (
              <motion.div 
                key="running-flow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12"
              >
                <div className="lg:col-span-12">
                   <StatusFlow progress={displayProgress} currentStageIndex={currentStageIndex} />
                </div>
                <div className="lg:col-span-12">
                   <LogsPanel logs={displayLogs} />
                </div>
              </motion.div>
            )}

            {migrationStatus === 'completed' && data && (
              <motion.div 
                key="result"
                ref={reportRef}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12 pb-20"
              >
                {(() => {
                  const logs = data.logs || [];
                  const summary = logs.find(l => l.startsWith("[SUMMARY]"));
                  const risks = logs.filter(l => l.includes("[RISK"));
                  const manual = logs.filter(l => l.includes("[MANUAL]"));
                  const traceLogs = logs.filter(l =>
                    l.includes("[INFO]") || l.includes("[SUCCESS]") || l.includes("[ERROR]")
                  );

                  return (
                    <>
                      <SummaryCard content={summary} />
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ReportCard type="app" data={data} />
                        <ReportCard type="deploy" data={data} />
                      </div>

                      {/* Migration Intelligence Report Section */}
                      <div className="pt-8 space-y-10">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-black/5 dark:border-white/10"></div>
                          </div>
                          <div className="relative flex justify-center">
                            <span className="px-6 bg-[#F5F7FB] dark:bg-[#0B0F19] text-[10px] font-black uppercase tracking-[0.5em] text-accent-cyan transition-colors">
                              Migration Intelligence Report
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                          <div className="lg:col-span-12 xl:col-span-7">
                            <MigrationDelta summary={data.migration_summary} />
                          </div>
                          <div className="lg:col-span-12 xl:col-span-5">
                            <DependenciesTable dependencies={data.dependencies} />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-12">
                        <div className="lg:col-span-8 space-y-12">
                          <RiskSection risks={risks} />
                          <ManualActions actions={manual} />
                        </div>
                        <div className="lg:col-span-4 space-y-12">
                          <MetadataCard data={data} />
                          <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-purple-500/5 transition-colors">
                             <div className="flex items-center gap-3 mb-6">
                                <Terminal className="w-5 h-5 text-accent-cyan" />
                                <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-500 dark:text-white/40">Infrastructure Snapshot</h4>
                             </div>
                             <div className="space-y-6 text-xs font-mono text-slate-500 dark:text-white/60">
                                <div>
                                   <p className="opacity-40 mb-2 uppercase tracking-tighter text-[9px]">IMAGE_REGISTRY</p>
                                   <p className="truncate bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/5">{data.image_url}</p>
                                </div>
                                <div>
                                   <p className="opacity-40 mb-2 uppercase tracking-tighter text-[9px]">TERRAFORM_PLAN</p>
                                   <p className="truncate bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/5">{data.terraform_path}</p>
                                </div>
                             </div>
                          </div>
                        </div>
                      </div>
                      <div className="pt-12 border-t border-black/5 dark:border-white/5">
                        <LogsPanel logs={traceLogs} />
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            )}

            {migrationStatus === 'idle' && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center p-24 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[3rem]"
              >
                <div className="w-20 h-20 bg-slate-200/50 dark:bg-white/5 rounded-full flex items-center justify-center mb-8">
                  <Terminal className="w-10 h-10 text-slate-500 dark:text-white/10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-700 dark:text-white/40">Ready for Migration Analysis</h3>
                <p className="text-slate-600 dark:text-white/20 text-sm mt-3 font-medium text-center max-w-sm">Enter your repository details above to begin the automated intelligence phase.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      
      <footer className="mt-20 text-center pb-12 border-t border-black/5 dark:border-white/5 pt-12 z-10 relative">
         <p className="text-[10px] font-mono text-slate-500 dark:text-white/20 uppercase tracking-[0.4em]">CloudMorph © 2026 // Next-Gen Cloud Automation</p>
      </footer>
    </div>
  );
};

export default MigrationReport;
