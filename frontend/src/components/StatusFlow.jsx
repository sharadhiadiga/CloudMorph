import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

const STAGES = [
  { name: "Initializing Pipeline", messages: ["Establishing secure channel...", "Verifying environment..."] },
  { name: "Analyzing Repository", messages: ["Scanning source patterns...", "Detecting tech stack...", "Mapping dependencies..."] },
  { name: "Generating Docker Config", messages: ["Optimizing build layers...", "Injecting security headers...", "Configuring runtime binary..."] },
  { name: "Building Container Image", messages: ["Pulling base image...", "Executing build steps...", "Layering file systems...", "Pushing artifacts..."] },
  { name: "Provisioning Infrastructure", messages: ["Allocating cloud resources...", "Generating HCL state...", "Executing Terraform plan..."] },
  { name: "Deploying Application", messages: ["Checking container health...", "Updating DNS records...", "Warming up clusters..."] },
  { name: "Finalizing Report", messages: ["Synthesizing AI report...", "Formatting audit logs..."] }
];

const StatusFlow = ({ currentStageIndex, progress }) => {
  const [subMessageIndex, setSubMessageIndex] = useState(0);

  // Cycle through sub-messages for the active stage
  useEffect(() => {
    const stage = STAGES[currentStageIndex];
    if (stage && stage.messages.length > 1) {
      const interval = setInterval(() => {
        setSubMessageIndex(prev => (prev + 1) % stage.messages.length);
      }, 1500);
      return () => clearInterval(interval);
    }
    setSubMessageIndex(0);
  }, [currentStageIndex]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 py-8">
      {/* Percentage Progress Header */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-white/40">Migration Progress</h4>
        <span className="text-2xl font-black text-accent-cyan tracking-tighter">{Math.round(progress)}%</span>
      </div>
      
      {/* Main Progress Bar */}
      <div className="h-2 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden mb-12">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-accent-purple via-accent-blue to-accent-cyan"
        />
      </div>

      {/* Vertical Steps */}
      <div className="space-y-6">
        {STAGES.map((stageData, index) => {
          const isCompleted = index < currentStageIndex;
          const isActive = index === currentStageIndex;
          const stageName = stageData.name;

          return (
            <div key={stageName} className="relative flex items-center gap-6 group">
              {/* Connector Line */}
              {index !== STAGES.length - 1 && (
                <div className="absolute left-[15px] top-8 w-0.5 h-6 bg-slate-200 dark:bg-white/5" />
              )}

              {/* Icon / Indicator */}
              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div 
                      key="done"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-emerald-500 bg-emerald-500/10 rounded-full p-1 border border-emerald-500/20"
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </motion.div>
                  ) : isActive ? (
                    <motion.div 
                      key="active"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-accent-cyan bg-accent-cyan/10 rounded-full p-1 shadow-[0_0_20px_rgba(34,211,238,0.3)] border border-accent-cyan/20"
                    >
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </motion.div>
                  ) : (
                    <div className="text-slate-300 dark:text-white/5 p-1">
                      <Circle className="w-6 h-6" />
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Label & Thinking Text */}
              <div className="flex-1">
                <p className={`text-base font-bold transition-all duration-500 ${
                  isActive ? 'text-slate-900 dark:text-white' : 
                  isCompleted ? 'text-emerald-500/70' : 'text-slate-400 dark:text-white/20'
                }`}>
                  {stageName}
                </p>
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.p 
                      key={subMessageIndex}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-[11px] text-accent-cyan/80 font-bold uppercase tracking-wider mt-0.5 opacity-60"
                    >
                      {stageData.messages[subMessageIndex]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusFlow;
