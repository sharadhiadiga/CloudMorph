'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Navbar } from '@/components/navbar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/status-badge'
import { AlertCircle, CheckCircle, Lightbulb, ArrowRight } from 'lucide-react'

export default function Analysis() {
  const router = useRouter()

  const analysisData = {
    language: 'Java',
    framework: 'Spring Boot',
    dependencies: ['spring-core', 'spring-web', 'spring-data-jpa', 'postgresql', 'hibernate'],
    database: 'PostgreSQL 12',
    codeMetrics: {
      lines: '45,230',
      files: '324',
      complexity: 'Moderate',
    },
  }

  const detectedIssues = [
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
  ]

  const suggestedFixes = [
    {
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      title: 'Use Environment Variables',
      description: 'Replace hardcoded credentials with environment variable injection',
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      title: 'Add Actuator Endpoints',
      description: 'Spring Boot Actuator can automatically expose required health endpoints',
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      title: 'Optimize Base Image',
      description: 'Use multi-stage Docker builds to reduce final image size',
    },
  ]

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden md:ml-0 ml-0">
        <Navbar projectName="Application Analysis" status="active" />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Analysis Results</h1>
              <p className="text-slate-400">
                Comprehensive analysis of your legacy application ready for containerization
              </p>
            </div>

            {/* Detection Summary */}
            <Card className="bg-slate-900/50 border-slate-700 p-8">
              <h2 className="text-xl font-bold text-white mb-6">Detected Application Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-slate-400 text-sm mb-2">Language</p>
                  <p className="text-2xl font-bold text-white">{analysisData.language}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-2">Framework</p>
                  <p className="text-2xl font-bold text-white">{analysisData.framework}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-2">Database</p>
                  <p className="text-2xl font-bold text-white">{analysisData.database}</p>
                </div>
              </div>
            </Card>

            {/* Dependencies */}
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <h2 className="text-lg font-bold text-white mb-4">Dependencies</h2>
              <div className="flex flex-wrap gap-2">
                {analysisData.dependencies.map((dep) => (
                  <Badge key={dep} variant="secondary">
                    {dep}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Issues */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
                Detected Issues
              </h2>
              <div className="space-y-4">
                {detectedIssues.map((issue, index) => (
                  <Card
                    key={index}
                    className="bg-slate-900/50 border-slate-700 p-6 border-l-4"
                    style={{
                      borderLeftColor:
                        issue.severity === 'error' ? '#ef4444' : '#eab308',
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-2">{issue.title}</h3>
                        <p className="text-sm text-slate-400">{issue.description}</p>
                      </div>
                      <StatusBadge
                        status={issue.severity === 'error' ? 'error' : 'warning'}
                        label={issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                        size="sm"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Suggested Fixes */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-blue-400" />
                Suggested Fixes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {suggestedFixes.map((fix, index) => (
                  <Card key={index} className="bg-slate-900/50 border-slate-700 p-6">
                    <div className="mb-3">{fix.icon}</div>
                    <h3 className="font-semibold text-white mb-2">{fix.title}</h3>
                    <p className="text-sm text-slate-400">{fix.description}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-6">
              <Button variant="outline" onClick={() => router.back()}>
                Back
              </Button>
              <Button
                onClick={() => router.push('/dockerfile')}
                className="bg-blue-600 hover:bg-blue-700 gap-2"
              >
                View Dockerfile <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
