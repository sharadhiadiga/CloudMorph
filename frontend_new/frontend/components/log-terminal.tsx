'use client'

import { useEffect, useRef } from 'react'
import { Terminal } from 'lucide-react'

interface LogTerminalProps {
  logs: string[]
  isRunning?: boolean
}

export function LogTerminal({ logs, isRunning = false }: LogTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className="bg-black border border-slate-700 rounded-lg overflow-hidden">
      <div className="bg-slate-950 border-b border-slate-700 px-4 py-3 flex items-center gap-2">
        <Terminal className="w-4 h-4 text-green-400" />
        <span className="text-sm font-mono text-slate-400">Migration Logs</span>
        {isRunning && (
          <div className="ml-auto">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
        )}
      </div>
      <div
        ref={scrollRef}
        className="h-96 overflow-y-auto p-4 font-mono text-sm space-y-1 bg-black"
      >
        {logs.length === 0 ? (
          <div className="text-slate-600">$ Waiting for logs...</div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`${
                log.includes('ERROR')
                  ? 'text-red-400'
                  : log.includes('WARNING')
                  ? 'text-yellow-400'
                  : log.includes('✓') || log.includes('SUCCESS')
                  ? 'text-green-400'
                  : 'text-slate-300'
              }`}
            >
              {log}
            </div>
          ))
        )}
        {isRunning && <div className="text-green-400 animate-pulse">$ _</div>}
      </div>
    </div>
  )
}
