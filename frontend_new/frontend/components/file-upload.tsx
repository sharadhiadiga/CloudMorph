'use client'

import { useState } from 'react'
import { Upload, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface FileUploadProps {
  onUpload: (file: File) => void
  onGithubUrl: (url: string) => void
  isLoading?: boolean
}

export function FileUpload({ onUpload, onGithubUrl, isLoading = false }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [githubUrl, setGithubUrl] = useState('')
  const [uploadMethod, setUploadMethod] = useState<'file' | 'github'>('file')

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      onUpload(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files[0]) {
      onUpload(files[0])
    }
  }

  const handleGithubSubmit = () => {
    if (githubUrl.trim()) {
      onGithubUrl(githubUrl)
      setGithubUrl('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <Button
          variant={uploadMethod === 'file' ? 'default' : 'outline'}
          onClick={() => setUploadMethod('file')}
          className={uploadMethod === 'file' ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload ZIP
        </Button>
        <Button
          variant={uploadMethod === 'github' ? 'default' : 'outline'}
          onClick={() => setUploadMethod('github')}
          className={uploadMethod === 'github' ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          <Github className="w-4 h-4 mr-2" />
          GitHub URL
        </Button>
      </div>

      {uploadMethod === 'file' ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
            dragActive
              ? 'border-blue-500 bg-blue-500/5'
              : 'border-slate-600 bg-slate-900/50 hover:border-slate-500'
          }`}
        >
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Drag and drop your ZIP file</h3>
          <p className="text-slate-400 mb-4">or click to browse your files</p>
          <input
            type="file"
            accept=".zip"
            onChange={handleFileInput}
            className="hidden"
            id="file-input"
            disabled={isLoading}
          />
          <label htmlFor="file-input">
            <Button variant="secondary" asChild disabled={isLoading}>
              <span>Select File</span>
            </Button>
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">GitHub Repository URL</label>
            <Input
              type="url"
              placeholder="https://github.com/username/repository"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              disabled={isLoading}
              className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <Button
            onClick={handleGithubSubmit}
            disabled={!githubUrl.trim() || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Processing...' : 'Analyze Repository'}
          </Button>
        </div>
      )}
    </div>
  )
}
