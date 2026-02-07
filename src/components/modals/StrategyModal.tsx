import { X, TrendingUp, TrendingDown, ArrowRight, AlertTriangle, Lightbulb } from 'lucide-react'
import type { Deal } from '../../types'

interface StrategyModalProps {
  deal: Deal
  onClose: () => void
}

export default function StrategyModal({ deal, onClose }: StrategyModalProps) {
  const strategy = deal.strategy

  if (!strategy) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <p className="text-slate-400">No strategy available for this deal.</p>
        </div>
      </div>
    )
  }

  const getStrategyColor = () => {
    switch (strategy.primary) {
      case 'Flip': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30'
      case 'Short Hold': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'Long Hold': return 'text-purple-400 bg-purple-500/20 border-purple-500/30'
      case 'Avoid': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'Grade First': return 'text-amber-400 bg-amber-500/20 border-amber-500/30'
      default: return 'text-slate-400 bg-slate-700'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl relative my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStrategyColor()}`}>
                  {strategy.primary}
                </span>
                <span className="text-slate-400 text-sm">{strategy.confidence}% confidence</span>
              </div>
              <h2 className="text-xl font-bold text-white">{deal.cardName}</h2>
              <p className="text-slate-400">{deal.cardSet} • {deal.year} • {deal.grade}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="mt-4 text-slate-300 leading-relaxed">{strategy.reasoning}</p>
        </div>

        {/* Projected Returns */}
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Projected Returns by Timeframe
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {strategy.scenarios.map((scenario, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-500 mb-2">{scenario.timeframe}</p>
                <p className={`text-2xl font-bold ${
                  scenario.projectedReturn >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {scenario.projectedReturn > 0 ? '+' : ''}{scenario.projectedReturn}%
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {scenario.confidence}% conf • {scenario.liquidity} liq
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Factors */}
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Key Factors
          </h3>
          <div className="space-y-3">
            {strategy.keyFactors.map((factor, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-800/30 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  {factor.impact === 'positive' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                  {factor.impact === 'negative' && <TrendingDown className="w-4 h-4 text-red-400" />}
                  {factor.impact === 'neutral' && <div className="w-4 h-4 rounded-full bg-slate-500" />}
                  <span className="text-white font-medium">{factor.factor}</span>
                </div>
                <span className="text-slate-400 text-sm">{factor.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risks */}
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Risks to Consider
          </h3>
          <ul className="space-y-2">
            {strategy.risks.map((risk, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="text-red-400 mt-1">•</span>
                {risk}
              </li>
            ))}
          </ul>
        </div>

        {/* Alternatives */}
        <div className="p-6">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Alternative Approaches
          </h3>
          <ul className="space-y-2">
            {strategy.alternatives.map((alt, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                <ArrowRight className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                {alt}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
