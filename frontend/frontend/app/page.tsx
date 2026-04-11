'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Box, Cpu, FileText } from 'lucide-react'

export default function Landing() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-blue-400" />
          <span className="text-xl font-bold text-white">MigrationAI</span>
        </div>
        <Button
          onClick={() => router.push('/dashboard')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Login
        </Button>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="max-w-4xl text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Migrate Legacy Apps to Cloud <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">in Minutes</span>
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            AI-powered containerization and Kubernetes deployment for your legacy applications. Automate analysis, Docker generation, and cloud deployment.
          </p>

          <Button
            onClick={() => router.push('/upload')}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg gap-2 rounded-xl"
          >
            Start Migration <ArrowRight className="w-5 h-5" />
          </Button>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="AI Analysis"
              description="Intelligent detection of languages, frameworks, and dependencies"
            />
            <FeatureCard
              icon={<Box className="w-6 h-6" />}
              title="Docker Generation"
              description="Automatic Dockerfile creation with best practices"
            />
            <FeatureCard
              icon={<Cpu className="w-6 h-6" />}
              title="Kubernetes Deployment"
              description="Ready-to-deploy K8s manifests and configurations"
            />
            <FeatureCard
              icon={<FileText className="w-6 h-6" />}
              title="Migration Report"
              description="Detailed reports with risks and manual steps"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition-colors">
      <div className="text-blue-400 mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  )
}
