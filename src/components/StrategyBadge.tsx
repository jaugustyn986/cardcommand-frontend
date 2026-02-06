import type { Strategy } from '../types'

interface StrategyBadgeProps {
  strategy: Strategy
  size?: 'sm' | 'md' | 'lg'
}

export default function StrategyBadge({ strategy, size = 'md' }: StrategyBadgeProps) {
  const colors = {
    'Flip': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'Short Hold': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Long Hold': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Avoid': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Grade First': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  }

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full border ${colors[strategy.primary]} ${sizeClasses[size]}`}>
      <span className="w-2 h-2 rounded-full bg-current" />
      {strategy.primary}
      <span className="opacity-70">({strategy.confidence}%)</span>
    </span>
  )
}
