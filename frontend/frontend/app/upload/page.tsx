'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Navbar } from '@/components/navbar'
import { FileUpload } from '@/components/file-upload'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/progress-bar'

export default function Upload() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const handleFileUpload = async (file: File) => {
    setIsLoading(true)
    setSelectedFile(file.name)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + Math.random() * 30
      })
    }, 300)

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval)
      setUploadProgress(100)
      setTimeout(() => {
        router.push('/analysis')
      }, 1000)
    }, 3000)
  }

  const handleGithubUrl = async (url: string) => {
    setIsLoading(true)
    setSelectedFile(url)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + Math.random() * 30
      })
    }, 300)

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval)
      setUploadProgress(100)
      setTimeout(() => {
        router.push('/analysis')
      }, 1000)
    }, 3000)
  }

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden md:ml-0 ml-0">
        <Navbar projectName="Upload Application" status="idle" />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Upload Your Application</h1>
              <p className="text-slate-400">
                Start by uploading your legacy application or GitHub repository for AI-powered analysis
              </p>
            </div>

            <Card className="bg-slate-900/50 border-slate-700 p-8 mb-8">
              <FileUpload
                onUpload={handleFileUpload}
                onGithubUrl={handleGithubUrl}
                isLoading={isLoading}
              />
            </Card>

            {selectedFile && (
              <Card className="bg-slate-900/50 border-slate-700 p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Upload Progress</h3>
                    <p className="text-sm text-slate-400 mb-4">{selectedFile}</p>
                  </div>
                  <ProgressBar value={uploadProgress} />
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>{Math.round(uploadProgress)}%</span>
                    <span>
                      {uploadProgress === 100 ? 'Complete - Redirecting...' : 'Uploading...'}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Card className="bg-slate-900/50 border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Supported Formats</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>• ZIP archives (.zip)</li>
                  <li>• GitHub repositories (HTTPS URL)</li>
                  <li>• GitLab repositories (HTTPS URL)</li>
                  <li>• Bitbucket repositories (HTTPS URL)</li>
                </ul>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">What We Analyze</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>✓ Programming languages</li>
                  <li>✓ Frameworks and dependencies</li>
                  <li>✓ Database configurations</li>
                  <li>✓ Security issues</li>
                </ul>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
