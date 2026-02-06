import { TrendingUp, TrendingDown, Minus, Search } from 'lucide-react'
import type { TrendingItem } from '../types'

interface TrendingCardProps {
  item: TrendingItem
}

export default function TrendingCard({ item }: TrendingCardProps) {
  const getSentimentColor = () => {
    switch (item.sentiment) {
      case 'Bullish': return 'text-emerald-400 bg-emerald-500/20'
      case 'Bearish': return 'text-red-400 bg-red-500/20'
      default: return 'text-slate-400 bg-slate-500/20'
    }
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-emerald-400" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-400" />
    return <Minus className="w-4 h-4 text-slate-400" />
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-emerald-500/30 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white">{item.cardName}</h3>
          <p className="text-sm text-slate-400">{item.cardSet}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded ${getSentimentColor()}`}>
          {item.sentiment}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Current Price</span>
          <span className="font-bold text-white">${item.currentPrice}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-slate-800 rounded p-2 text-center">
            <p className="text-slate-500 mb-1">24h</p>
            <p className={`font-medium flex items-center justify-center gap-1 ${item.priceChange24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {getChangeIcon(item.priceChange24h)}
              {item.priceChange24h > 0 ? '+' : ''}{item.priceChange24h}%
            </p>
          </div>
          <div className="bg-slate-800 rounded p-2 text-center">
            <p className="text-slate-500 mb-1">7d</p>
            <p className={`font-medium flex items-center justify-center gap-1 ${item.priceChange7d >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {getChangeIcon(item.priceChange7d)}
              {item.priceChange7d > 0 ? '+' : ''}{item.priceChange7d}%
            </p>
          </div>
          <div className="bg-slate-800 rounded p-2 text-center">
            <p className="text-slate-500 mb-1">30d</p>
            <p className={`font-medium flex items-center justify-center gap-1 ${item.priceChange30d >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {getChangeIcon(item.priceChange30d)}
              {item.priceChange30d > 0 ? '+' : ''}{item.priceChange30d}%
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Search className="w-3 h-3" />
            {item.searchVolume.toLocaleString()} searches
          </span>
          <span>Vol: {item.volumeIncrease > 0 ? '+' : ''}{item.volumeIncrease}%</span>
        </div>
      </div>
    </div>
  )
}
