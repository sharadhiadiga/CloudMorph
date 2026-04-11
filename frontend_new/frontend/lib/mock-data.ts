import type { Project, AnalysisResult, DetectedIssue, MigrationReport } from './types'

export const mockProjects: Project[] = [
  {
    id: 1,
    name: 'Legacy Java App',
    framework: 'Spring Boot',
    language: 'Java',
    status: 'completed',
    date: '2024-01-15',
    description: 'E-commerce platform built with Spring Boot',
  },
  {
    id: 2,
    name: 'Python Web Service',
    framework: 'Django',
    language: 'Python',
    status: 'completed',
    date: '2024-01-10',
    description: 'REST API service for data processing',
  },
  {
    id: 3,
    name: 'Node.js Backend',
    framework: 'Express',
    language: 'JavaScript',
    status: 'in-progress',
    date: '2024-01-20',
    description: 'Real-time chat application backend',
  },
  {
    id: 4,
    name: 'Ruby on Rails App',
    framework: 'Rails',
    language: 'Ruby',
    status: 'completed',
    date: '2024-01-08',
    description: 'Content management system',
  },
  {
    id: 5,
    name: 'ASP.NET Legacy',
    framework: 'ASP.NET',
    language: 'C#',
    status: 'completed',
    date: '2024-01-05',
    description: 'Financial reporting application',
  },
]

export const mockAnalysisResult: AnalysisResult = {
  language: 'Java',
  framework: 'Spring Boot',
  dependencies: [
    'spring-core',
    'spring-web',
    'spring-data-jpa',
    'postgresql',
    'hibernate',
    'jackson-databind',
    'junit',
    'mockito',
  ],
  database: 'PostgreSQL 12',
  codeMetrics: {
    lines: '45,230',
    files: '324',
    complexity: 'Moderate',
  },
}

export const mockDetectedIssues: DetectedIssue[] = [
  {
    severity: 'warning',
    title: 'Hardcoded Database Credentials',
    description: 'Found 3 instances of hardcoded DB credentials in application.properties',
  },
  {
    severity: 'warning',
    title: 'Legacy Java Version',
    description: 'Application uses Java 8. Consider upgrading to Java 17+ for better performance',
  },
  {
    severity: 'error',
    title: 'Missing Health Check Endpoints',
    description: 'Kubernetes deployment requires /health and /ready endpoints',
  },
  {
    severity: 'warning',
    title: 'No Input Validation',
    description: 'API endpoints lack input validation on 12 controllers',
  },
]

export const mockMigrationReport: MigrationReport = {
  projectName: 'Legacy Java Application',
  migrationDate: '2024-01-20',
  duration: '2 hours 14 minutes',
  succeeded: [
    'Code analysis and framework detection',
    'Dockerfile generation with best practices',
    'Kubernetes manifests created',
    'Docker image built successfully',
    'Application deployed to Kubernetes',
    'Health checks configured and passing',
  ],
  risks: [
    'Hardcoded database credentials were found - use environment variables instead',
    'Application currently uses Java 8 - consider upgrading to Java 17+',
    'No authentication configured for admin endpoints',
    'Missing input validation in API endpoints',
  ],
  manualSteps: [
    'Configure database connection strings in environment variables',
    'Set up SSL certificates for HTTPS communication',
    'Configure persistent volumes for data storage',
    'Set up monitoring and logging infrastructure',
    'Create CI/CD pipeline for automated deployments',
  ],
}

export const mockDeploymentLogs = [
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
