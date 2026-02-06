import { TrendingUp, TrendingDown, Package } from 'lucide-react'
import type { PortfolioItem } from '../types'

interface PortfolioCardProps {
  item: PortfolioItem
}

export default function PortfolioCard({ item }: PortfolioCardProps) {
  const profit = item.currentValue - item.purchasePrice
  const profitPercent = (profit / item.purchasePrice) * 100
  const isProfit = profit >= 0

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all">
      <div className="relative aspect-[4/3] bg-slate-800">
        <img 
          src={item.imageUrl || '/placeholder-card.png'} 
          alt={item.cardName}
          className="w-full h-full object-cover"
        />
        {item.inGradingQueue && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
            In Grading
          </div>
        )}
        {item.quantity > 1 && (
          <div className="absolute top-2 right-2 bg-slate-700 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            <Package className="w-3 h-3" />
            x{item.quantity}
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-white line-clamp-1">{item.cardName}</h3>
          <p className="text-sm text-slate-400">{item.cardSet} • {item.year}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500">Current Value</p>
            <p className="text-lg font-bold text-white">${item.currentValue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Purchase Price</p>
            <p className="text-lg font-bold text-slate-400">${item.purchasePrice.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            {isProfit ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className={`font-semibold ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
              {isProfit ? '+' : ''}{profit.toLocaleString()} ({profitPercent.toFixed(1)}%)
            </span>
          </div>
          <span className="text-sm text-slate-400">{item.grade}</span>
        </div>
      </div>
    </div>
  )
}
