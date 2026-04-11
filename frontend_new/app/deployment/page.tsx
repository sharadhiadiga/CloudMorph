'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Navbar } from '@/components/navbar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StepProgress } from '@/components/step-progress'
import { LogTerminal } from '@/components/log-terminal'
import { ArrowRight } from 'lucide-react'

export default function Deployment() {
  const router = useRouter()
  const [logs, setLogs] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isDeploying, setIsDeploying] = useState(false)

  const steps = [
    { id: '1', label: 'Analyzing', status: 'completed' as const },
    { id: '2', label: 'Containerizing', status: 'completed' as const },
    { id: '3', label: 'Deploying', status: 'active' as const },
    { id: '4', label: 'Running', status: 'pending' as const },
  ]

  const mockLogs = [
    '$ docker build -t legacy-app:latest .',
    'Step 1/12 : FROM eclipse-temurin:17-jdk-alpine AS builder',
    'Step 2/12 : WORKDIR /workspace',
    'Step 3/12 : COPY . .',
    '✓ Fetching source files',
    'Step 4/12 : RUN ./mvnw clean package -DskipTests',
    '✓ Building with Maven',
    'Step 5/12 : FROM eclipse-temurin:17-jre-alpine',
    'Step 6/12 : RUN addgroup -g 1000 app && adduser -D -u 1000 -G app app',
    'Step 7/12 : WORKDIR /app',
    'Step 8/12 : COPY --from=builder /workspace/target/*.jar app.jar',
    '✓ Image built successfully',
    '$ kubectl apply -f deployment.yaml',
    'deployment.apps/legacy-app created',
    'service/legacy-app created',
    '✓ Kubernetes resources deployed',
    '$ kubectl rollout status deployment/legacy-app',
    'Waiting for deployment "legacy-app" rollout to finish: 1 of 3 new replicas have been updated...',
    '✓ 2 of 3 replicas ready',
    '✓ All replicas deployed successfully',
    '$ kubectl get pods',
    'legacy-app-5d4f8c9b7d-abc12   1/1     Running   0          10s',
    'legacy-app-5d4f8c9b7d-def34   1/1     Running   0          8s',
    'legacy-app-5d4f8c9b7d-ghi56   1/1     Running   0          5s',
    'SUCCESS: Application is running on Kubernetes',
  ]

  useEffect(() => {
    if (!isDeploying) {
      setIsDeploying(true)

      // Simulate deployment logs
      mockLogs.forEach((log, index) => {
        setTimeout(() => {
          setLogs((prev) => [...prev, log])

          // Update step based on progress
          if (index >= 8 && currentStep < 1) setCurrentStep(1)
          if (index >= 14 && currentStep < 2) setCurrentStep(2)
          if (index >= mockLogs.length - 1) setCurrentStep(3)
        }, index * 300)
      })
    }
  }, [])

  const updateStepStatus = (stepIndex: number) => {
    return steps.map((step, index) => {
      if (index < stepIndex) return { ...step, status: 'completed' as const }
      if (index === stepIndex) return { ...step, status: 'active' as const }
      return { ...step, status: 'pending' as const }
    })
  }

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden md:ml-0 ml-0">
        <Navbar projectName="Deployment Progress" status="active" />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Deployment in Progress</h1>
              <p className="text-slate-400">
                Your application is being containerized and deployed to Kubernetes
              </p>
            </div>

            {/* Step Progress */}
            <Card className="bg-slate-900/50 border-slate-700 p-8">
              <StepProgress steps={updateStepStatus(currentStep)} />
            </Card>

            {/* Logs */}
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <h2 className="text-lg font-bold text-white mb-4">Deployment Logs</h2>
              <LogTerminal logs={logs} isRunning={currentStep < 3} />
            </Card>

            {/* Status */}
            {currentStep === 3 && (
              <Card className="bg-green-500/10 border-green-500/30 p-6 border-l-4 border-l-green-500">
                <h3 className="font-semibold text-green-400 mb-2">✓ Deployment Complete!</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Your application has been successfully deployed to Kubernetes. All services are running
                  and healthy.
                </p>
                <div className="bg-slate-900/50 p-4 rounded text-sm font-mono text-green-400 mb-4">
                  Service URL: http://legacy-app.default.svc.cluster.local
                </div>
                <Button variant="secondary" size="sm">
                  View in Kubernetes Dashboard
                </Button>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-6">
              {currentStep === 3 && (
                <Button
                  onClick={() => router.push('/reports')}
                  className="bg-blue-600 hover:bg-blue-700 gap-2"
                >
                  View Migration Report <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
