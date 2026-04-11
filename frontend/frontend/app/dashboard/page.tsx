'use client'

import { Sidebar } from '@/components/sidebar'
import { Navbar } from '@/components/navbar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, AlertCircle, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()

  const projects = [
    {
      id: 1,
      name: 'Legacy Java App',
      framework: 'Spring Boot',
      status: 'completed',
      date: '2024-01-15',
    },
    {
      id: 2,
      name: 'Python Web Service',
      framework: 'Django',
      status: 'completed',
      date: '2024-01-10',
    },
    {
      id: 3,
      name: 'Node.js Backend',
      framework: 'Express',
      status: 'in-progress',
      date: '2024-01-20',
    },
  ]

  const stats = [
    {
      label: 'Total Projects',
      value: '12',
      icon: Zap,
      color: 'text-blue-400',
    },
    {
      label: 'Successful Migrations',
      value: '11',
      icon: CheckCircle,
      color: 'text-green-400',
    },
    {
      label: 'In Progress',
      value: '1',
      icon: AlertCircle,
      color: 'text-yellow-400',
    },
  ]

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden md:ml-0 ml-0">
        <Navbar projectName="Dashboard" status="active" />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <Card key={stat.label} className="bg-slate-900/50 border-slate-700 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                      </div>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Projects */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Recent Projects</h2>
                <Button
                  onClick={() => router.push('/upload')}
                  className="bg-blue-600 hover:bg-blue-700 gap-2"
                >
                  New Migration <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid gap-4">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="bg-slate-900/50 border-slate-700 p-6 hover:border-slate-600 transition-colors cursor-pointer"
                    onClick={() => router.push(`/analysis?project=${project.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>{project.framework}</span>
                          <span>•</span>
                          <span>{project.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            project.status === 'completed'
                              ? 'bg-green-500/10 text-green-400'
                              : 'bg-yellow-500/10 text-yellow-400'
                          }`}
                        >
                          {project.status === 'completed' ? '✓ Completed' : 'In Progress'}
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-600" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
