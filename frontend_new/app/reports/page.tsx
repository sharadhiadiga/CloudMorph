'use client'

import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Navbar } from '@/components/navbar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertCircle, Download, Share2 } from 'lucide-react'

export default function Reports() {
  const router = useRouter()

  const reportData = {
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

  const handleDownloadReport = () => {
    // Simulate report download
    const reportContent = `
Migration Report: ${reportData.projectName}
Generated: ${reportData.migrationDate}
Duration: ${reportData.duration}

WHAT SUCCEEDED:
${reportData.succeeded.map((item) => `✓ ${item}`).join('\n')}

IDENTIFIED RISKS:
${reportData.risks.map((risk) => `⚠ ${risk}`).join('\n')}

MANUAL STEPS REQUIRED:
${reportData.manualSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}
    `

    const element = document.createElement('a')
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(reportContent)}`)
    element.setAttribute('download', 'migration-report.txt')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden md:ml-0 ml-0">
        <Navbar projectName="Migration Report" status="active" />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Migration Report</h1>
                <p className="text-slate-400">{reportData.projectName}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleDownloadReport}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button variant="outline" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-900/50 border-slate-700 p-6">
                <p className="text-slate-400 text-sm mb-2">Migration Date</p>
                <p className="text-2xl font-bold text-white">{reportData.migrationDate}</p>
              </Card>
              <Card className="bg-slate-900/50 border-slate-700 p-6">
                <p className="text-slate-400 text-sm mb-2">Total Duration</p>
                <p className="text-2xl font-bold text-white">{reportData.duration}</p>
              </Card>
              <Card className="bg-slate-900/50 border-slate-700 p-6">
                <p className="text-slate-400 text-sm mb-2">Status</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <p className="text-2xl font-bold text-white">Successful</p>
                </div>
              </Card>
            </div>

            {/* What Succeeded */}
            <Card className="bg-green-500/5 border-green-500/30 p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                What Succeeded
              </h2>
              <div className="space-y-3">
                {reportData.succeeded.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Identified Risks */}
            <Card className="bg-yellow-500/5 border-yellow-500/30 p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
                Identified Risks
              </h2>
              <div className="space-y-3">
                {reportData.risks.map((risk, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{risk}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Manual Steps */}
            <Card className="bg-slate-900/50 border-slate-700 p-8">
              <h2 className="text-xl font-bold text-white mb-6">Manual Steps Required</h2>
              <div className="space-y-4">
                {reportData.manualSteps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="pt-1">
                      <p className="text-white">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Next Steps */}
            <Card className="bg-slate-900/50 border-slate-700 p-6 border-l-4 border-l-blue-500">
              <h3 className="font-semibold text-white mb-3">Next Steps</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>1. Review this report and address any identified risks</li>
                <li>2. Complete all manual steps listed above</li>
                <li>3. Set up CI/CD pipeline for automated deployments</li>
                <li>4. Configure monitoring and alerting systems</li>
                <li>5. Plan and execute production deployment</li>
              </ul>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-6">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
              <Button
                onClick={() => router.push('/upload')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Migrate Another App
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
