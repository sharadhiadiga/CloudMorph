import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Send, Cpu, CheckCircle } from 'lucide-react';
import StatusLoader from './components/StatusLoader';
import ReportCard from './components/ReportCard';
import LogsPanel from './components/LogsPanel';
import MetadataCard from './components/MetadataCard';
import ExportButtons from './components/ExportButtons';
import ThemeToggle from './components/ThemeToggle';
import SummaryCard from './components/SummaryCard';
import RiskSection from './components/RiskSection';
import ManualActions from './components/ManualActions';

const MigrationReport = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [repoUrl, setRepoUrl] = useState('https://github.com/example/inventory-api');
  
  // Ref for PDF export
  const reportRef = useRef(null);

  const runMigration = async () => {
    setLoading(true);
    setData(null);

    try {
      // Simulate real latency
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResult = {
        "app_name": "inventory-api",
        "stack": "node",
        "port": 3000,
        "source_path": "./src/components/api",
        "dockerfile_path": "./Dockerfile",
        "image_name": "inventory-api-v1",
        "image_url": "gcr.io/cloudmorph-ai/inventory-api:v1",
        "terraform_path": "./infra/main.tf",
        "deployment_url": "https://inventory-api.cloudmorph.run",
        "logs": [
          "[INFO] Migration pipeline started.",
          "[INFO] Analysis phase completed successfully.",
          "[SUCCESS] Docker image built and available.",
          "[INFO] Infrastructure configuration generated via Terraform.",
          "[SUCCESS] Deployment completed successfully.",
          "[SUMMARY] The application 'inventory-api' was successfully analyzed and containerized and deployed to the target cloud environment using a Node.js stack. The primary services are operational with a verified deployment endpoint.",
          "[RISK_LOW] No major risks identified. The system appears stable and production-ready.",
          "[MANUAL] Configure production environment variables and implement secure secrets management.",
          "[MANUAL] Set up cloud monitoring and automated alerting (e.g., logs, performance metrics).",
          "[MANUAL] Implement a CI/CD pipeline to automate future application deployments.",
          "[MANUAL] Configure custom domain and validate DNS routing records for the live service.",
          "[MANUAL] Perform security hardening including authentication and rate limiting configuration.",
          "[SUGGESTION] Use PM2 for Node.js process management in production.",
          "[INFO] Container image stored at: gcr.io/cloudmorph-ai/inventory-api:v1",
          "[INFO] Application live at: https://inventory-api.cloudmorph.run",
          "[AI] CloudMorph-AI analysis complete. Repository matches CloudNative standards. Auto-scaling is pre-configured based on observed Node.js thread limits."
        ]
      };
      
      setData(mockResult);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B0F19] text-[#111] dark:text-gray-100 transition-colors duration-300 relative overflow-hidden">
      <ThemeToggle />
      
      {/* Dynamic Animated Background Glows */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-accent-purple/10 dark:bg-accent-purple/20 blur-[150px] rounded-full pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.05, 0.1, 0.05],
          x: [0, -40, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent-blue/10 dark:bg-accent-blue/20 blur-[150px] rounded-full pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10 px-6 py-12">
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left space-y-2">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 justify-center md:justify-start"
            >
              <Cpu className="w-5 h-5 text-accent-cyan" />
              <span className="text-xs font-bold uppercase tracking-widest text-accent-cyan">Intelligence Phase</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white"
            >
              CloudMorph<span className="bg-clip-text text-transparent bg-neon-gradient">AI</span>
            </motion.h1>
            <p className="text-slate-500 dark:text-white/50 text-lg font-medium">Automated Enterprise Cloud Migration</p>
          </div>

          <div className="flex flex-col items-end gap-4 w-full md:w-auto">
            <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-xl p-2 rounded-2xl flex items-center gap-2 w-full md:w-auto shadow-xl shadow-purple-500/5">
              <input 
                type="text" 
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="Enter Repository URL"
                className="bg-transparent border-none outline-none text-slate-900 dark:text-white/80 px-4 py-2 text-sm w-full lg:w-96 placeholder:text-slate-400"
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
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <ExportButtons data={data} reportRef={reportRef} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <StatusLoader text="AI Engine Analyzing Repository Context..." />
              </motion.div>
            )}

            {data && !loading && (() => {
              // Strict Filtering Logic
              const summary = data.logs.find(log => log.startsWith('[SUMMARY]'));
              const risks = data.logs.filter(log => log.startsWith('[RISK_'));
              const manual = data.logs.filter(log => log.startsWith('[MANUAL]'));
              const traceLogs = data.logs.filter(log => 
                !log.startsWith('[SUMMARY]') && 
                !log.startsWith('[RISK_') && 
                !log.startsWith('[MANUAL]') &&
                !log.startsWith('[AI]') // Exclude AI signature from trace
              );

              return (
                <motion.div 
                  key="result"
                  ref={reportRef}
                  id="report-area"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-12 pb-20"
                >
                  {/* 1. MIGRATION SUMMARY (Hero Focus) */}
                  <SummaryCard content={summary} />

                  {/* 2. CORE METRICS & DATA */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <ReportCard type="app" data={data} />
                     <ReportCard type="deploy" data={data} />
                  </div>

                  {/* 3. INTELLIGENCE & AUDIT SECTION */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left Column: Risks & Actions */}
                    <div className="lg:col-span-8 space-y-12">
                      <RiskSection risks={risks} />
                      <ManualActions actions={manual} />
                    </div>
                    
                    {/* Right Column: Metadata & Snapshot */}
                    <div className="lg:col-span-4 space-y-12">
                      <MetadataCard data={data} />
                      
                      <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl shadow-purple-500/5 transition-colors duration-300">
                        <div className="flex items-center gap-3 mb-4">
                          <Terminal className="w-5 h-5 text-accent-cyan" />
                          <h4 className="font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-white/70">Infrastructure Snapshot</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="text-sm font-mono text-slate-500 dark:text-white/60">
                            <p className="mb-1 text-[10px] uppercase font-bold tracking-wider opacity-60">IMAGE_REGISTRY</p>
                            <p className="bg-slate-50 dark:bg-white/5 p-2 rounded truncate border border-black/5 dark:border-white/5 text-slate-700 dark:text-white/70">{data.image_url || 'NULL'}</p>
                          </div>
                          <div className="text-sm font-mono text-slate-500 dark:text-white/60">
                            <p className="mb-1 text-[10px] uppercase font-bold tracking-wider opacity-60">PROVISIONER_MANIFEST</p>
                            <p className="bg-slate-50 dark:bg-white/5 p-2 rounded truncate border border-black/5 dark:border-white/5 text-slate-700 dark:text-white/70">{data.terraform_path || 'NULL'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. TECHNICAL TRACE (Secondary) */}
                  <div className="pt-12 border-t border-black/5 dark:border-white/5">
                    <LogsPanel logs={traceLogs} />
                  </div>
                </motion.div>
              );
            })()}

            {!loading && !data && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl"
              >
                <Terminal className="w-16 h-16 text-slate-200 dark:text-white/10 mb-6" />
                <h3 className="text-xl font-bold text-slate-400 dark:text-white/40">Ready for Migration Analysis</h3>
                <p className="text-slate-300 dark:text-white/20 text-sm mt-2 font-medium">Enter your repository details above to begin the intelligence phase.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      
      <footer className="mt-20 text-center pb-8 border-t border-black/5 dark:border-white/5 pt-8 z-10 relative">
         <p className="text-xs font-mono text-slate-400 dark:text-white/20 uppercase tracking-[0.2em]">CloudMorph-AI © 2026 // Next-Gen Cloud Automation</p>
      </footer>
    </div>
  );
};

export default MigrationReport;
