import React, { useState, useEffect, useRef } from "react";
import { 
  Cloud, 
  UploadCloud, 
  GitBranch, 
  ArrowRight,
  CheckCircle2, 
  Loader2,
  Box,
  Globe,
  Settings,
  ShieldAlert,
  Database,
  Code
} from "lucide-react";

// --- Simple ui utility ---
const cn = (...classes) => classes.filter(Boolean).join(" ");

const Card = ({ className, children }) => (
  <div className={cn("bg-white/80 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all", className)}>
    {children}
  </div>
);

// --- Content Data ---
const MOCK_RESULT = {
  app_name: "legacy-finance-app",
  stack: "Java Spring Boot",
  port: 8080,
  image_url: "gcr.io/cloudmorph/legacy-finance",
  terraform_path: "/infra/main.tf",
  deployment_url: "https://finance-app.run.app",
  dependencies: [
    { name: "spring-core", old: "4.3.x", new: "5.3.x", status: "updated" },
    { name: "log4j", old: "1.2.x", new: "2.17.x", status: "critical fix" },
    { name: "postgresql", old: "9.6", new: "13.0", status: "updated" },
  ],
  summary: {
    issues_fixed: 12,
    warnings: 3,
  },
};

const STEPS = [
  "Uploaded",
  "Analyzing codebase",
  "Fixing Dependencies",
  "Containerizing",
  "Deploying to Cloud",
  "Completed",
];

// --- Main Page Component ---
export default function Home() {
  const [phase, setPhase] = useState("idle"); // idle | running | done
  const [currentStep, setCurrentStep] = useState(-1);
  const [result, setResult] = useState(null);

  const [file, setFile] = useState(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleStart = () => {
    setPhase("running");
    setCurrentStep(0);
    setResult(null);
  };

  useEffect(() => {
    if (phase !== "running") return;
    
    if (currentStep >= STEPS.length) {
      setTimeout(() => {
        setCurrentStep(STEPS.length - 1);
        setResult(MOCK_RESULT);
        setPhase("done");
      }, 600);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((s) => s + 1);
    }, 1200);

    return () => clearTimeout(timer);
  }, [phase, currentStep]);

  return (
    <div className="flex h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-blue-100 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200/60 bg-white/50 backdrop-blur-md flex flex-col justify-between shrink-0 h-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8 rounded-xl bg-blue-600 shadow-lg shadow-blue-500/30 flex items-center justify-center">
              <Cloud size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800">CloudMorph</span>
          </div>

          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-blue-50/50 text-blue-600 rounded-xl font-medium transition-colors">
              <Box size={18} className="shrink-0" />
              Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-xl font-medium transition-colors">
              <Database size={18} className="shrink-0" />
              Resources
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-xl font-medium transition-colors">
              <Code size={18} className="shrink-0" />
              Blueprints
            </button>
          </nav>
        </div>

        <div className="p-6">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-xl font-medium transition-colors">
            <Settings size={18} className="shrink-0" />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50/20 to-transparent">
        
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3" />

        <div className="max-w-5xl mx-auto px-8 py-12 pb-24 space-y-10 min-h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Migration Dashboard</h1>
              <p className="text-slate-500 mt-1 font-medium">Automate legacy app migration to cloud</p>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm border border-slate-200/60">
              <div className={cn("w-2 h-2 rounded-full", phase === 'running' ? 'bg-blue-500 animate-pulse' : phase === 'done' ? 'bg-emerald-500' : 'bg-slate-300')} />
              <span className="text-[13px] font-semibold text-slate-600 uppercase tracking-widest px-1">
                {phase === 'running' ? 'Processing' : phase === 'done' ? 'Completed' : 'Idle'}
              </span>
            </div>
          </div>

          {/* Section 1: Upload (Hidden/Faded when done if we want, but keeping it visible as per prompt "fade in sections" - let's keep it visible but disabled) */}
          <Card className={cn("overflow-hidden transition-opacity duration-500", phase !== "idle" && "opacity-60 scale-[0.99] pointer-events-none")}>
            <div className="p-8 pb-6 border-b border-slate-100/60 bg-white/40">
              <h2 className="text-xl font-semibold text-slate-800">New Migration Task</h2>
              <p className="text-sm text-slate-500 mt-1">Upload your project or paste a GitHub URL</p>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => inputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-2xl py-14 flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
                  dragOver ? "border-blue-400 bg-blue-50/50 scale-[1.02]" : "border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-blue-50/30"
                )}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".zip"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                <div className={cn("p-4 rounded-full mb-4 transition-colors", dragOver ? "bg-blue-100 text-blue-500" : "bg-white text-slate-400 shadow-sm border border-slate-100")}>
                  <UploadCloud size={28} />
                </div>
                {file ? (
                  <div className="text-center">
                    <p className="text-base font-semibold text-slate-700">{file.name}</p>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Ready to upload</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-base font-medium text-slate-600">Drag & drop ZIP file</p>
                    <p className="text-sm text-slate-400 mt-1">or click to browse</p>
                  </div>
                )}
              </div>

              {/* GitHub Link */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <GitBranch size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="w-full text-sm outline-none bg-white border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-700 placeholder:text-slate-400 font-medium focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
                />
              </div>

              {/* Action Button */}
              <button
                onClick={handleStart}
                disabled={phase !== "idle" || (!file && !repoUrl.trim())}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl h-14 flex items-center justify-center gap-2 text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                Start Migration
                <ArrowRight size={18} />
              </button>
            </div>
          </Card>

          {/* Section 2: Live Status */}
          {(phase === "running" || phase === "done") && (
            <Card className="p-2 animate-[fade-in_0.5s_ease-out_forwards]">
              <div className="p-6 space-y-2">
                {STEPS.map((step, idx) => {
                  const isCompleted = idx < currentStep;
                  const isActive = idx === currentStep;
                  const isPending = idx > currentStep;

                  return (
                    <div
                      key={step}
                      className={cn(
                        "flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-500",
                        isActive && "bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-slate-100 scale-[1.01] z-10 relative",
                        isCompleted && "opacity-70",
                        isPending && "opacity-40"
                      )}
                    >
                      <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-slate-100 bg-white shadow-sm">
                        {isCompleted ? (
                          <CheckCircle2 size={18} className="text-emerald-500" />
                        ) : isActive ? (
                          <Loader2 size={18} className="text-blue-500 animate-spin" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-200" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-[15px] tracking-tight",
                          isCompleted && "text-slate-500 font-medium",
                          isActive && "text-slate-900 font-semibold",
                          isPending && "text-slate-400 font-medium"
                        )}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Section 3: Results */}
          {phase === "done" && result && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-[fade-in_0.8s_ease-out_forwards]">
              
              {/* App Info */}
              <Card className="p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">App Info</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Application Name</div>
                      <div className="font-semibold text-slate-800">{result.app_name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Stack Recognized</div>
                      <div className="font-semibold text-slate-800">{result.stack}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100/80">
                  <div className="text-sm text-slate-500 mb-1">Exposed Port</div>
                  <div className="font-mono text-sm text-slate-700 bg-slate-100/50 w-fit px-2 py-0.5 rounded">{result.port}</div>
                </div>
              </Card>

              {/* Deployment */}
              <Card className="p-6 flex flex-col justify-between group">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Deployment</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Live Endpoint</div>
                      <a href={result.deployment_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 font-medium hover:text-blue-700 hover:underline">
                        <Globe size={14} />
                        {result.deployment_url.replace('https://', '')}
                      </a>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Container Image</div>
                      <div className="font-mono text-[11px] text-slate-600 break-all">{result.image_url}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100/80">
                  <div className="text-sm text-slate-500 mb-1">IaC Config</div>
                  <div className="font-mono text-xs text-slate-600">{result.terraform_path}</div>
                </div>
              </Card>

              {/* Dependencies */}
              <Card className="p-6 lg:col-span-2 flex flex-col">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Dependency Updates</h3>
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="pb-3 font-medium text-slate-500 min-w-[120px]">Package</th>
                        <th className="pb-3 font-medium text-slate-500 px-4">Old</th>
                        <th className="pb-3 font-medium text-slate-500 px-4">New</th>
                        <th className="pb-3 font-medium text-slate-500 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {result.dependencies.map((dep, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 font-mono text-xs font-medium text-slate-700">{dep.name}</td>
                          <td className="py-3 px-4 text-slate-500">{dep.old}</td>
                          <td className="py-3 px-4 text-emerald-600 font-medium">{dep.new}</td>
                          <td className="py-3 text-right">
                            <span className={cn(
                              "inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              dep.status.includes('critical') 
                                ? "bg-red-50 text-red-600 border border-red-100" 
                                : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            )}>
                              {dep.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Summary */}
              <Card className="p-6 col-span-1 md:col-span-2 lg:col-span-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/20 border-none relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay opacity-10"></div>
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Migration Completed Successfully</h2>
                    <p className="text-white/80 text-sm">Your application is now running in the cloud.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-white/10 rounded-xl p-4 min-w-[120px] backdrop-blur-sm border border-white/10">
                      <div className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">Issues Fixed</div>
                      <div className="text-3xl font-bold">{result.summary.issues_fixed}</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 min-w-[120px] backdrop-blur-sm border border-white/10">
                      <div className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">Warnings</div>
                      <div className="text-3xl font-bold flex items-center gap-2">
                        {result.summary.warnings}
                        {result.summary.warnings > 0 && <ShieldAlert size={20} className="text-amber-300" />}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

            </div>
          )}

        </div>
      </main>

    </div>
  );
}
