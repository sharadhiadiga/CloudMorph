'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Upload, Zap, Package, FileText, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/upload', label: 'Upload', icon: Upload },
  { href: '/analysis', label: 'Analysis', icon: Zap },
  { href: '/deployment', label: 'Deployment', icon: Package },
  { href: '/reports', label: 'Reports', icon: FileText },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 hover:bg-slate-800 rounded-lg md:hidden"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Menu className="w-5 h-5 text-white" />
        )}
      </button>

      <aside
        className={`fixed left-0 top-0 h-screen bg-slate-950 border-r border-slate-700 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 px-6 py-6 border-b border-slate-700">
            <Zap className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-bold text-white">MigrationAI</span>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link key={href} href={href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-slate-700 p-6">
            <div className="text-xs text-slate-500 mb-3">Version 1.0.0</div>
            <Button variant="ghost" size="sm" className="w-full text-slate-400 hover:text-white">
              Help & Feedback
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content offset */}
      <div className={`transition-all duration-300 ${isOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        {/* Content goes here */}
      </div>
    </>
  )
}
