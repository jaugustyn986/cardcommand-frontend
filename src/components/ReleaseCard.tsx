import { Calendar, DollarSign, Flame, Package, TrendingUp } from 'lucide-react'
import type { Release } from '../types'

interface ReleaseCardProps {
  release: Release
}

export default function ReleaseCard({ release }: ReleaseCardProps) {
  const daysUntil = Math.ceil((new Date(release.releaseDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const isReleased = daysUntil <= 0
  const profitPotential = release.estimatedResale && release.msrp 
    ? ((release.estimatedResale - release.msrp) / release.msrp * 100).toFixed(0)
    : null

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all">
      {/* Header with image or placeholder */}
      <div className="relative h-32 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
        <div className="absolute top-3 left-3">
          <span className="bg-slate-700/80 backdrop-blur text-white text-xs font-medium px-2 py-1 rounded uppercase">
            {release.category}
          </span>
        </div>
        
        <div className="absolute top-3 right-3">
          {isReleased ? (
            <span className="bg-emerald-500/80 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded">
              Released
            </span>
          ) : daysUntil <= 30 ? (
            <span className="bg-amber-500/80 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded">
              {daysUntil} days
            </span>
          ) : (
            <span className="bg-slate-700/80 backdrop-blur text-white text-xs font-medium px-2 py-1 rounded">
              {Math.floor(daysUntil / 30)} months
            </span>
          )}
        </div>

        {release.imageUrl ? (
          <img
            src={release.imageUrl}
            alt={release.name}
            className="w-full h-full object-contain p-4"
          />
        ) : (
          <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
            <Package className="w-8 h-8 text-slate-500" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-white text-sm">{release.name}</h3>
          <p className="text-xs text-slate-400">{release.manufacturer}</p>
        </div>

        {/* Price info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <DollarSign className="w-3 h-3" />
            <span>MSRP: ${release.msrp}</span>
          </div>
          {release.estimatedResale && (
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span>Est: ${release.estimatedResale}</span>
            </div>
          )}
        </div>

        {/* Profit potential */}
        {profitPotential && (
          <div className="flex items-center justify-between bg-emerald-500/10 rounded-lg p-2">
            <span className="text-xs text-slate-400">Profit Potential</span>
            <span className="text-sm font-bold text-emerald-400">+{profitPotential}%</span>
          </div>
        )}

        {/* Hype score */}
        {release.hypeScore && (
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-red-500"
                style={{ width: `${(release.hypeScore / 10) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-400">{release.hypeScore}/10</span>
          </div>
        )}

        {/* Top chases */}
        {release.topChases.length > 0 && (
          <div className="pt-2 border-t border-slate-800">
            <p className="text-xs text-slate-500 mb-2">Top Chases:</p>
            <div className="flex flex-wrap gap-1">
              {release.topChases.slice(0, 3).map((chase, i) => (
                <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                  {chase}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Release date */}
        <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
          <Calendar className="w-3 h-3" />
          {new Date(release.releaseDate).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </div>
      </div>
    </div>
  )
}
