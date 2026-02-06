import { useMemo } from 'react'

export default function Heatmap() {
  const heatmapData = useMemo(() => {
    const categories = ['Baseball', 'Basketball', 'Football', 'TCG']
    const priceRanges = ['$0-50', '$50-250', '$250-1K', '$1K+']
    
    // Generate mock heatmap data
    const bubbles = categories.flatMap((cat, catIndex) => 
      priceRanges.map((range, rangeIndex) => ({
        x: rangeIndex,
        y: catIndex,
        size: Math.random() * 30 + 10,
        value: Math.random() * 100,
        label: `${cat} ${range}`,
      }))
    )

    return { categories, priceRanges, bubbles }
  }, [])

  const getColor = (value: number) => {
    if (value > 75) return 'bg-emerald-500'
    if (value > 50) return 'bg-emerald-400'
    if (value > 25) return 'bg-emerald-300'
    return 'bg-emerald-200'
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Market Heatmap</h3>
      
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-8 space-y-8">
          {heatmapData.categories.map((cat) => (
            <div key={cat} className="text-xs text-slate-400 h-8 flex items-center">
              {cat}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="ml-16">
          {/* X-axis labels */}
          <div className="flex gap-2 mb-2">
            {heatmapData.priceRanges.map((range) => (
              <div key={range} className="flex-1 text-xs text-slate-400 text-center">
                {range}
              </div>
            ))}
          </div>

          {/* Heatmap cells */}
          <div className="grid grid-cols-4 gap-2">
            {heatmapData.bubbles.map((bubble, i) => (
              <div
                key={i}
                className={`aspect-square rounded-lg ${getColor(bubble.value)} opacity-80 hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center`}
                title={bubble.label}
              >
                <span className="text-xs font-medium text-slate-900">
                  {Math.round(bubble.value)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-400">
        <span>Low Activity</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 bg-emerald-200 rounded" />
          <div className="w-4 h-4 bg-emerald-300 rounded" />
          <div className="w-4 h-4 bg-emerald-400 rounded" />
          <div className="w-4 h-4 bg-emerald-500 rounded" />
        </div>
        <span>High Activity</span>
      </div>
    </div>
  )
}
