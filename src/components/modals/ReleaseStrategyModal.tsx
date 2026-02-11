import { X, ExternalLink, Flame, Lightbulb } from 'lucide-react'
import type { ReleaseProduct, ReleaseConfidence } from '../../types'

interface ReleaseStrategyModalProps {
  product: ReleaseProduct
  onClose: () => void
}

function strategyFromConfidence(confidence?: ReleaseConfidence): { label: string; className: string } {
  switch (confidence) {
    case 'confirmed':
      return { label: 'Short Hold', className: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' }
    case 'unconfirmed':
      return { label: 'Watch', className: 'text-amber-400 bg-amber-500/20 border-amber-500/30' }
    case 'rumor':
      return { label: 'Rumor', className: 'text-slate-400 bg-slate-600/30 border-slate-500/30' }
    default:
      return { label: '—', className: 'text-slate-400 bg-slate-700/50 border-slate-600/30' }
  }
}

function confidenceLabel(c?: ReleaseConfidence): string {
  switch (c) {
    case 'confirmed':
      return 'High'
    case 'unconfirmed':
      return 'Medium'
    case 'rumor':
      return 'Low'
    default:
      return '—'
  }
}

export default function ReleaseStrategyModal({ product, onClose }: ReleaseStrategyModalProps) {
  const chip = product.strategy
    ? (() => {
        switch (product.strategy.primary) {
          case 'Flip':
            return { label: 'Flip', className: 'text-sky-400 bg-sky-500/20 border-sky-500/30' }
          case 'Short Hold':
            return { label: 'Short Hold', className: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' }
          case 'Long Hold':
            return { label: 'Long Hold', className: 'text-purple-400 bg-purple-500/20 border-purple-500/30' }
          case 'Avoid':
            return { label: 'Avoid', className: 'text-red-400 bg-red-500/20 border-red-500/30' }
          case 'Watch':
            return { label: 'Watch', className: 'text-amber-400 bg-amber-500/20 border-amber-500/30' }
          default:
            return strategyFromConfidence(product.confidence)
        }
      })()
    : strategyFromConfidence(product.confidence)
  const hasResaleProfit =
    product.estimatedResale != null && product.msrp != null && product.estimatedResale > product.msrp

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg relative my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${chip.className}`}>
                  {chip.label}
                </span>
                <span className="text-slate-400 text-sm">
                  {product.strategy
                    ? `${product.strategy.confidence}% confidence`
                    : `${confidenceLabel(product.confidence)} confidence`}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{product.name}</h2>
              <p className="text-slate-400 text-sm mt-1">{product.setName} • {product.productType.replace(/_/g, ' ')}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white flex-shrink-0" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Price summary */}
        <div className="p-6 border-b border-slate-800 space-y-2">
          {product.msrp !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">MSRP</span>
              <span className="text-slate-200">${product.msrp}</span>
            </div>
          )}
          {product.estimatedResale !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Est. Resale</span>
              <span className={hasResaleProfit ? 'text-emerald-400 font-semibold' : 'text-slate-200'}>
                ${product.estimatedResale}
              </span>
            </div>
          )}
          {product.setHypeScore != null && (
            <div className="flex items-center gap-2 pt-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400 text-sm">Hype score {product.setHypeScore}/10</span>
            </div>
          )}
        </div>

        {/* Top chases / contents */}
        {product.strategy?.reasonSummary && (
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Strategy summary</h3>
            <p className="text-slate-300 text-sm">{product.strategy.reasonSummary}</p>
          </div>
        )}

        {product.contentsSummary && (
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Top chases</h3>
            <p className="text-slate-300 text-sm">{product.contentsSummary}</p>
          </div>
        )}

        {product.strategy?.keyFactors && product.strategy.keyFactors.length > 0 && (
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Key factors</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              {product.strategy.keyFactors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">➜</span>
                  <span>
                    <span className="font-medium">{factor.factor}: </span>
                    <span>{factor.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Links */}
        <div className="p-6">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Links
          </h3>
          <ul className="space-y-2">
            {product.buyUrl && (
              <li>
                <a
                  href={product.buyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm"
                >
                  View product
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
            )}
            {product.sourceUrl && (
              <li>
                <a
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-slate-300 hover:text-white text-sm"
                >
                  Source / article
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
            )}
            {!product.buyUrl && !product.sourceUrl && (
              <li className="text-slate-500 text-sm">No links available for this product.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
