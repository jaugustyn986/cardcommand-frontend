import { Calendar, DollarSign, Flame } from 'lucide-react'
import type { Release } from '../types'

interface ReleaseCardProps {
  release: Release
}

export default function ReleaseCard({ release }: ReleaseCardProps) {
  const daysUntil = Math.ceil((new Date(release.releaseDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const isReleased = daysUntil <= 0

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all">
      <div className="relative aspect-video bg-slate-800">
        <img 
          src={release.imageUrl || '/placeholder-release.png'} 
          alt={release.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur text-white text-xs font-medium px-2 py-1 rounded">
          {release.category}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-white">{release.name}</h3>
          <p className="text-sm text-slate-400">{release.manufacturer}</p>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-slate-400">
            <Calendar className="w-4 h-4" />
            {isReleased ? (
              <span className="text-emerald-400">Released</span>
            ) : (
              <span>{daysUntil} days</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <DollarSign className="w-4 h-4" />
            <span>${release.msrp}</span>
          </div>
        </div>

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

        {release.estimatedResale && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Est. Resale:</span>
            <span className="text-emerald-400 font-medium">${release.estimatedResale}</span>
          </div>
        )}

        {release.topChases.length > 0 && (
          <div className="pt-2 border-t border-slate-800">
            <p className="text-xs text-slate-500 mb-2">Top Chases:</p>
            <div className="flex flex-wrap gap-1">
              {release.topChases.map((chase, i) => (
                <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                  {chase}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
