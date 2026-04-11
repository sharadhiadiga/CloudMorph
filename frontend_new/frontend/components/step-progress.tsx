import { Check } from 'lucide-react'

interface Step {
  id: string
  label: string
  status: 'completed' | 'active' | 'pending'
}

interface StepProgressProps {
  steps: Step[]
}

export function StepProgress({ steps }: StepProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step circle */}
            <div className="relative z-10 flex items-center justify-center">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                  step.status === 'completed'
                    ? 'bg-green-500 border-green-500'
                    : step.status === 'active'
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-slate-700 border-slate-600'
                }`}
              >
                {step.status === 'completed' ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-white text-sm font-semibold">{index + 1}</span>
                )}
              </div>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 bg-slate-700">
                <div
                  className={`h-full transition-all ${
                    steps[index + 1].status === 'completed' || steps[index + 1].status === 'active'
                      ? 'bg-green-500'
                      : 'bg-slate-600'
                  }`}
                  style={{
                    width:
                      steps[index + 1].status === 'completed' || steps[index + 1].status === 'active'
                        ? '100%'
                        : '0%',
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-4">
        {steps.map((step) => (
          <div key={step.id} className="text-xs font-medium text-slate-400">
            {step.label}
          </div>
        ))}
      </div>
    </div>
  )
}
