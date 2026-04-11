import {
  mockProjects,
  mockAnalysisResult,
  mockDetectedIssues,
  mockMigrationReport,
  mockDeploymentLogs,
} from './mock-data'
import type { Project, AnalysisResult, DetectedIssue, MigrationReport } from './types'

// Simulate API calls with realistic delays
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const apiService = {
  // Projects
  async getProjects(): Promise<Project[]> {
    await delay(500)
    return mockProjects
  },

  async getProject(id: number): Promise<Project | undefined> {
    await delay(300)
    return mockProjects.find((p) => p.id === id)
  },

  async createProject(data: Partial<Project>): Promise<Project> {
    await delay(1000)
    const newProject: Project = {
      id: Math.max(...mockProjects.map((p) => p.id)) + 1,
      name: data.name || 'New Project',
      framework: data.framework || 'Unknown',
      language: data.language || 'Unknown',
      status: 'in-progress',
      date: new Date().toISOString().split('T')[0],
    }
    mockProjects.push(newProject)
    return newProject
  },

  // Analysis
  async analyzeProject(projectId: number): Promise<AnalysisResult> {
    await delay(2000)
    return mockAnalysisResult
  },

  async getAnalysisIssues(projectId: number): Promise<DetectedIssue[]> {
    await delay(500)
    return mockDetectedIssues
  },

  // Deployment
  async deployProject(projectId: number): Promise<string[]> {
    await delay(500)
    return mockDeploymentLogs
  },

  async getDeploymentStatus(projectId: number): Promise<{
    status: 'pending' | 'deploying' | 'completed' | 'failed'
    progress: number
  }> {
    await delay(300)
    return {
      status: 'deploying',
      progress: Math.floor(Math.random() * 100),
    }
  },

  // Reports
  async getMigrationReport(projectId: number): Promise<MigrationReport> {
    await delay(500)
    return mockMigrationReport
  },

  async generateDockerfile(projectId: number): Promise<string> {
    await delay(1000)
    return `FROM eclipse-temurin:17-jdk-alpine AS builder

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
CMD ["java", "-jar", "app.jar"]`
  },

  async generateKubernetesConfig(projectId: number): Promise<string> {
    await delay(1000)
    return `apiVersion: apps/v1
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
  type: LoadBalancer`
  },
}
