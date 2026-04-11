import { Check, AlertCircle, XCircle, Clock } from 'lucide-react'

type StatusType = 'success' | 'warning' | 'error' | 'pending'

interface StatusBadgeProps {
  status: StatusType
  label: string
  size?: 'sm' | 'md' | 'lg'
}

const statusConfig = {
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    icon: Check,
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    icon: AlertCircle,
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    icon: XCircle,
  },
  pending: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    icon: Clock,
  },
}

export function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <div className={`${config.bg} ${config.border} border rounded-full flex items-center gap-2 ${sizeClasses[size]} w-fit`}>
      <Icon className={`w-4 h-4 ${config.text}`} />
      <span className={`${config.text} font-medium`}>{label}</span>
    </div>
  )
}
