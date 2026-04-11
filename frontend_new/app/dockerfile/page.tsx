'use client'

import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Navbar } from '@/components/navbar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CodeViewer } from '@/components/code-viewer'
import { ArrowRight, FileText } from 'lucide-react'

const dockerfileContent = `FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /workspace
COPY . .
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine

RUN addgroup -g 1000 app && \\
    adduser -D -u 1000 -G app app

WORKDIR /app
COPY --from=builder /workspace/target/*.jar app.jar
COPY --chown=app:app docker-entrypoint.sh ./

RUN chmod +x docker-entrypoint.sh

USER app

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["java", "-jar", "app.jar"]
`

const kubernetesContent = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: legacy-app
  labels:
    app: legacy-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: legacy-app
  template:
    metadata:
      labels:
        app: legacy-app
    spec:
      containers:
      - name: legacy-app
        image: legacy-app:latest
        ports:
        - containerPort: 8080
        env:
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: db.host
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: db.password
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 1000m
            memory: 1Gi
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: legacy-app
spec:
  selector:
    app: legacy-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer
`

export default function Dockerfile() {
  const router = useRouter()

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden md:ml-0 ml-0">
        <Navbar projectName="Dockerfile & Kubernetes Configuration" status="active" />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Generated Configurations</h1>
              <p className="text-slate-400">
                Auto-generated Dockerfile and Kubernetes manifests ready for deployment
              </p>
            </div>

            {/* Dockerfile */}
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white">Dockerfile</h2>
              </div>
              <CodeViewer code={dockerfileContent} language="dockerfile" filename="Dockerfile" />
            </Card>

            {/* Kubernetes Config */}
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white">Kubernetes Manifest</h2>
              </div>
              <CodeViewer
                code={kubernetesContent}
                language="yaml"
                filename="deployment"
              />
            </Card>

            {/* Info */}
            <Card className="bg-slate-900/50 border-slate-700 p-6 border-l-4 border-l-blue-500">
              <h3 className="font-semibold text-white mb-2">What&apos;s Included</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>✓ Multi-stage Docker build for optimized image size</li>
                <li>✓ Health checks and probes configured</li>
                <li>✓ Kubernetes Deployment with 3 replicas</li>
                <li>✓ Service exposed as LoadBalancer</li>
                <li>✓ Environment variable and secret management</li>
                <li>✓ Resource limits and requests configured</li>
              </ul>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-6">
              <Button variant="outline" onClick={() => router.back()}>
                Back
              </Button>
              <Button
                onClick={() => router.push('/deployment')}
                className="bg-blue-600 hover:bg-blue-700 gap-2"
              >
                Proceed to Deployment <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
