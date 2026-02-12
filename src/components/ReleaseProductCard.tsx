import { ChevronRight } from 'lucide-react'
import type { ReleaseProduct, ReleaseConfidence, ReleaseProductStrategy } from '../types'

interface ReleaseProductCardProps {
  product: ReleaseProduct
  onViewStrategy?: (product: ReleaseProduct) => void
}

function categoryLabel(category: string): string {
  return category.replace(/_/g, ' ').toUpperCase()
}

function strategyFromConfidence(
  confidence?: ReleaseConfidence,
  strategy?: ReleaseProductStrategy,
): { label: string; className: string } {
  if (strategy?.primary) {
    switch (strategy.primary) {
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
        break
    }
  }

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

function confidenceBand(confidence?: ReleaseConfidence, confidenceScore?: number): 'High' | 'Medium' | 'Low' | '—' {
  if (confidence === 'confirmed') return 'High'
  if (confidence === 'unconfirmed') return 'Medium'
  if (confidence === 'rumor') return 'Low'
  if (confidenceScore == null) return '—'
  if (confidenceScore >= 70) return 'High'
  if (confidenceScore >= 40) return 'Medium'
  return 'Low'
}

function statusLabel(status?: string): string {
  if (!status) return '—'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function sourceTypeLabel(sourceType?: string): string {
  if (!sourceType) return '—'
  return sourceType.charAt(0).toUpperCase() + sourceType.slice(1)
}

export default function ReleaseProductCard({ product, onViewStrategy }: ReleaseProductCardProps) {
  const hasResaleProfit =
    product.estimatedResale != null && product.msrp != null && product.estimatedResale > product.msrp
  const strategy = strategyFromConfidence(product.confidence, product.strategy)
  const band = confidenceBand(product.confidence, product.confidenceScore)

  return (
    <div
      className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all flex flex-col"
      role={onViewStrategy ? 'button' : undefined}
      onClick={() => onViewStrategy?.(product)}
      onKeyDown={(e) => onViewStrategy && (e.key === 'Enter' || e.key === ' ') && onViewStrategy(product)}
      tabIndex={onViewStrategy ? 0 : undefined}
    >
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        {/* Top row: category left, release date + rating right */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
            {categoryLabel(product.category)}
          </span>
          <div className="flex items-center gap-2 flex-shrink-0">
            {product.releaseDate && (
              <span className="text-xs text-slate-400">
                {new Date(product.releaseDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            )}
            {product.setHypeScore != null && (
              <span className="px-2 py-0.5 rounded-md text-xs font-semibold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30">
                {product.setHypeScore}/10
              </span>
            )}
          </div>
        </div>

        {/* Product name */}
        <h3 className="font-bold text-slate-200 text-base leading-tight line-clamp-2">{product.name}</h3>

        {/* Trust metadata */}
        <div className="flex flex-wrap gap-1.5">
          <span className="px-2 py-0.5 rounded-md text-[11px] border border-slate-700 text-slate-300 bg-slate-800/70">
            {statusLabel(product.status)}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[11px] border border-slate-700 text-slate-300 bg-slate-800/70">
            {sourceTypeLabel(product.sourceType)}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[11px] border border-emerald-500/30 text-emerald-300 bg-emerald-500/10">
            {band}
            {product.confidenceScore != null ? ` (${product.confidenceScore})` : ''}
          </span>
        </div>

        {/* MSRP row — always show, — when missing */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">MSRP</span>
          <span className="text-slate-200">
            {product.msrp != null ? `$${product.msrp}` : '—'}
          </span>
        </div>

        {/* Est. Resale row — green when above MSRP, — when missing */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Est. Resale</span>
          <span className={hasResaleProfit ? 'text-emerald-400 font-semibold' : 'text-slate-200'}>
            {product.estimatedResale != null ? `$${product.estimatedResale}` : '—'}
          </span>
        </div>

        {/* Top chases (contents summary) — always show section */}
        <div className="pt-1">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">Top chases</p>
          <p className="text-xs text-slate-400 line-clamp-2">
            {product.contentsSummary || '—'}
          </p>
        </div>

        {/* Bottom row: strategy pill left, arrow right */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-800">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${strategy.className}`}>
            {strategy.label}
            <span className="text-slate-400 font-normal">—</span>
          </span>
          {onViewStrategy && (
            <span className="text-emerald-400 flex items-center gap-0.5 text-sm font-medium">
              View strategy
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
