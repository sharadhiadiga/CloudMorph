'use client'

import { Copy, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CodeViewerProps {
  code: string
  language?: 'dockerfile' | 'yaml' | 'json'
  filename?: string
}

export function CodeViewer({ code, language = 'dockerfile', filename = 'config' }: CodeViewerProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
  }

  const handleDownload = () => {
    const ext = language === 'dockerfile' ? 'Dockerfile' : language === 'yaml' ? 'yaml' : 'json'
    const element = document.createElement('a')
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(code)}`)
    element.setAttribute('download', `${filename}.${ext}`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
      <div className="bg-slate-950 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-slate-400">{filename}</span>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded uppercase">
            {language}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-slate-400 hover:text-white"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-slate-400 hover:text-white"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <pre className="bg-slate-900 p-6 overflow-x-auto text-sm font-mono text-slate-100 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}
