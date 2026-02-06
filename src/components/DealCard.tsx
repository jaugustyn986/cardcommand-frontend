import { ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { Deal } from '../types'

interface DealCardProps {
  deal: Deal
  onClick: () => void
}

export default function DealCard({ deal, onClick }: DealCardProps) {
  const savingsColor = deal.savingsPercent >= 20 ? 'text-emerald-400' : deal.savingsPercent >= 10 ? 'text-yellow-400' : 'text-slate-400'
  const trendIcon = deal.ninetyDayTrend && deal.ninetyDayTrend > 5 ? <TrendingUp className="w-4 h-4" /> : deal.ninetyDayTrend && deal.ninetyDayTrend < -5 ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />

  return (
    <div 
      onClick={onClick}
      className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all cursor-pointer group"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-slate-800 overflow-hidden">
        <img 
          src={deal.imageUrl || '/placeholder-card.png'} 
          alt={deal.cardName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded">
          {deal.savingsPercent.toFixed(1)}% OFF
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-white line-clamp-1">{deal.cardName}</h3>
          <p className="text-sm text-slate-400">{deal.cardSet} • {deal.year}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 line-through">${deal.marketPrice}</p>
            <p className="text-xl font-bold text-emerald-400">${deal.dealPrice}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Save</p>
            <p className={`font-semibold ${savingsColor}`}>${deal.savingsAmount}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            {trendIcon}
            {deal.ninetyDayTrend ? `${deal.ninetyDayTrend > 0 ? '+' : ''}${deal.ninetyDayTrend}%` : '0%'}
          </span>
          <span>{deal.grade}</span>
          <span className="flex items-center gap-1">
            {deal.marketplace}
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>

        {deal.strategy && (
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Strategy:</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                deal.strategy.primary === 'Flip' ? 'bg-emerald-500/20 text-emerald-400' :
                deal.strategy.primary === 'Short Hold' ? 'bg-blue-500/20 text-blue-400' :
                deal.strategy.primary === 'Long Hold' ? 'bg-purple-500/20 text-purple-400' :
                deal.strategy.primary === 'Avoid' ? 'bg-red-500/20 text-red-400' :
                'bg-amber-500/20 text-amber-400'
              }`}>
                {deal.strategy.primary}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
