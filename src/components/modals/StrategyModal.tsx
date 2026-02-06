import { X, TrendingUp, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react'
import type { Deal } from '../../types'

interface StrategyModalProps {
  deal: Deal
  onClose: () => void
}

export default function StrategyModal({ deal, onClose }: StrategyModalProps) {
  const strategy = deal.strategy

  if (!strategy) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <p className="text-slate-400">No strategy available for this deal.</p>
        </div>
      </div>
    )
  }

  const getPrimaryColor = () => {
    switch (strategy.primary) {
      case 'Flip': return 'text-emerald-400 bg-emerald-500/20'
      case 'Short Hold': return 'text-blue-400 bg-blue-500/20'
      case 'Long Hold': return 'text-purple-400 bg-purple-500/20'
      case 'Avoid': return 'text-red-400 bg-red-500/20'
      case 'Grade First': return 'text-amber-400 bg-amber-500/20'
      default: return 'text-slate-400 bg-slate-500/20'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPrimaryColor()}`}>
              {strategy.primary}
            </span>
            <span className="text-slate-400 text-sm">{strategy.confidence}% confidence</span>
          </div>
          <h2 className="text-xl font-bold text-white">{deal.cardName}</h2>
          <p className="text-slate-400">{deal.cardSet} • {deal.year} • {deal.grade}</p>
        </div>

        {/* Reasoning */}
        <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
          <p className="text-slate-300">{strategy.reasoning}</p>
        </div>

        {/* Scenarios */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Return Scenarios
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {strategy.scenarios.map((scenario, i) => (
              <div key={i} className="bg-slate-800 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-500 mb-1">{scenario.timeframe}</p>
                <p className="text-lg font-bold text-emerald-400">+{scenario.projectedReturn}%</p>
                <p className="text-xs text-slate-400">{scenario.confidence}% conf</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Factors */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Key Factors
          </h3>
          <div className="space-y-2">
            {strategy.keyFactors.map((factor, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-3">
                <span className={`w-2 h-2 rounded-full mt-1.5 ${
                  factor.impact === 'positive' ? 'bg-emerald-400' :
                  factor.impact === 'negative' ? 'bg-red-400' :
                  'bg-slate-400'
                }`} />
                <div>
                  <p className="text-sm font-medium text-white">{factor.factor}</p>
                  <p className="text-xs text-slate-400">{factor.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risks */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Risks
          </h3>
          <ul className="space-y-2">
            {strategy.risks.map((risk, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                {risk}
              </li>
            ))}
          </ul>
        </div>

        {/* Alternatives */}
        <div>
          <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Alternative Strategies
          </h3>
          <ul className="space-y-2">
            {strategy.alternatives.map((alt, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                {alt}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
