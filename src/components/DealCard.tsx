import { ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { Deal } from '../types'

interface DealCardProps {
  deal: Deal
  onClick: () => void
}

export default function DealCard({ deal, onClick }: DealCardProps) {
  // Convert string values to numbers
  const savingsPercent = Number(deal.savingsPercent)
  const savingsAmount = Number(deal.savingsAmount)
  const marketPrice = Number(deal.marketPrice)
  const dealPrice = Number(deal.dealPrice)
  const ninetyDayTrend = deal.ninetyDayTrend ? Number(deal.ninetyDayTrend) : null

  // Get strategy color
  const getStrategyColor = (strategy?: string) => {
    switch (strategy) {
      case 'Flip': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'Short Hold': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'Long Hold': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'Avoid': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'Grade First': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      default: return 'bg-slate-700 text-slate-400'
    }
  }

  const trendIcon = ninetyDayTrend && ninetyDayTrend > 5 ? <TrendingUp className="w-3 h-3" /> : 
                   ninetyDayTrend && ninetyDayTrend < -5 ? <TrendingDown className="w-3 h-3" /> : 
                   <Minus className="w-3 h-3" />

  return (
    <div 
      onClick={onClick}
      className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all cursor-pointer group"
    >
      {/* Image - smaller */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
        <img 
          src={deal.imageUrl || `https://placehold.co/400x300/1e293b/10b981?text=${encodeURIComponent(deal.cardName.substring(0, 15))}`} 
          alt={deal.cardName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded">
          {savingsPercent.toFixed(0)}% OFF
        </div>
      </div>

      {/* Content - compact */}
      <div className="p-3 space-y-2">
        <div>
          <h3 className="font-semibold text-white text-sm line-clamp-1">{deal.cardName}</h3>
          <p className="text-xs text-slate-400">{deal.cardSet} • {deal.year}</p>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 line-through">${marketPrice}</p>
            <p className="text-lg font-bold text-emerald-400">${dealPrice}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Save</p>
            <p className="text-sm font-semibold text-emerald-400">${savingsAmount}</p>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            {trendIcon}
            {ninetyDayTrend ? `${ninetyDayTrend > 0 ? '+' : ''}${ninetyDayTrend}%` : '0%'}
          </span>
          <span>{deal.grade}</span>
        </div>

        {/* Strategy badge + link */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          {deal.strategy ? (
            <span className={`text-xs font-medium px-2 py-0.5 rounded border ${getStrategyColor(deal.strategy.primary)}`}>
              {deal.strategy.primary} {deal.strategy.confidence}%
            </span>
          ) : (
            <span className="text-xs text-slate-500">No strategy</span>
          )}
          
          <a 
            href={deal.listingUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
          >
            {deal.marketplace}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
