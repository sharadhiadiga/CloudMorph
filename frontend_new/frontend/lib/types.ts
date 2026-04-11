export interface Project {
  id: number
  name: string
  framework: string
  language: string
  status: 'completed' | 'in-progress' | 'failed'
  date: string
  description?: string
}

export interface AnalysisResult {
  language: string
  framework: string
  dependencies: string[]
  database: string
  codeMetrics: {
    lines: string
    files: string
    complexity: string
  }
}

export interface DetectedIssue {
  severity: 'error' | 'warning'
  title: string
  description: string
}

export interface SuggestedFix {
  icon: React.ReactNode
  title: string
  description: string
}

export interface DeploymentLog {
  timestamp: string
  message: string
  level: 'info' | 'success' | 'warning' | 'error'
}

export interface MigrationReport {
  projectName: string
  migrationDate: string
  duration: string
  succeeded: string[]
  risks: string[]
  manualSteps: string[]
}
