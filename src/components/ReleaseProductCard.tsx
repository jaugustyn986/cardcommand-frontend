import { useState } from 'react'
import { Calendar, DollarSign, Flame, Package, TrendingUp, ExternalLink } from 'lucide-react'
import type { ReleaseProduct } from '../types'

interface ReleaseProductCardProps {
  product: ReleaseProduct
}

function placeholderForCategory(category: string): string {
  const label = encodeURIComponent(category.replace('_', ' '))
  return `https://placehold.co/320x160/1e293b/64748b?text=${label}`
}

export default function ReleaseProductCard({ product }: ReleaseProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false)

  const releaseDate = product.releaseDate ? new Date(product.releaseDate) : undefined
  const daysUntil =
    releaseDate != null
      ? Math.ceil((releaseDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : undefined
  const isReleased = daysUntil !== undefined ? daysUntil <= 0 : false

  const profitPotential =
    product.estimatedResale && product.msrp
      ? (((product.estimatedResale - product.msrp) / product.msrp) * 100).toFixed(0)
      : null

  const imageUrl = product.imageUrl || placeholderForCategory(product.category)
  const showImage = !imageFailed

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all">
      {/* Header with image or placeholder */}
      <div className="relative h-32 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span className="bg-slate-700/80 backdrop-blur text-white text-xs font-medium px-2 py-1 rounded uppercase">
            {product.category}
          </span>
          <span className="bg-slate-800/80 backdrop-blur text-slate-200 text-[10px] font-medium px-2 py-0.5 rounded">
            {product.setName}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          {isReleased ? (
            <span className="bg-emerald-500/80 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded">
              Released
            </span>
          ) : daysUntil != null && daysUntil <= 30 ? (
            <span className="bg-amber-500/80 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded">
              {daysUntil} days
            </span>
          ) : daysUntil != null ? (
            <span className="bg-slate-700/80 backdrop-blur text-white text-xs font-medium px-2 py-1 rounded">
              {Math.floor(daysUntil / 30)} months
            </span>
          ) : null}
        </div>

        {showImage ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-contain p-4 bg-slate-800/50"
            onError={() => setImageFailed(true)}
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
          <h3 className="font-semibold text-white text-sm line-clamp-2">{product.name}</h3>
          <p className="text-[11px] text-slate-400 uppercase tracking-wide">
            {product.productType.replace(/_/g, ' ')}
          </p>
        </div>

        {/* Price info */}
        <div className="flex items-center gap-4">
          {product.msrp !== undefined && (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <DollarSign className="w-3 h-3" />
              <span>MSRP: ${product.msrp}</span>
            </div>
          )}
          {product.estimatedResale !== undefined && (
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span>Est: ${product.estimatedResale}</span>
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
        {product.setHypeScore && (
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-red-500"
                style={{ width: `${(product.setHypeScore / 10) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-400">{product.setHypeScore}/10</span>
          </div>
        )}

        {/* Contents summary */}
        {product.contentsSummary && (
          <p className="text-xs text-slate-400 line-clamp-2">{product.contentsSummary}</p>
        )}

        {/* Release / preorder dates */}
        <div className="flex flex-col gap-1 pt-1">
          {product.preorderDate && (
            <div className="flex items-center gap-2 text-[11px] text-amber-300">
              <Calendar className="w-3 h-3" />
              <span>
                Preorders:{' '}
                {new Date(product.preorderDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}
          {product.releaseDate && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3 h-3" />
              {new Date(product.releaseDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          )}
        </div>

        {/* Buy link */}
        {product.buyUrl && (
          <a
            href={product.buyUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
          >
            View product
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  )
}

