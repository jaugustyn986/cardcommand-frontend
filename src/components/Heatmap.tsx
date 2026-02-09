// ============================================
// CardCommand Center - Heatmap Component
// ============================================

import { useEffect, useState } from 'react';
import { apiClient } from '../services/api';

interface HeatmapBubble {
  category: string;
  priceRange: string;
  volume: number;
  count: number;
  change: number;
  size: number;
}

interface HeatmapData {
  categories: string[];
  priceRanges: string[];
  bubbles: HeatmapBubble[];
}

export default function Heatmap() {
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const response = await apiClient.get('/trending/heatmap');
        if (response.data.success) {
          setHeatmapData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch heatmap:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmap();
  }, []);

  const categories = heatmapData?.categories || ['Baseball', 'Basketball', 'Football', 'TCG'];
  const priceRanges = heatmapData?.priceRanges || ['$0-50', '$50-250', '$250-1K', '$1K+'];
  const bubbles = heatmapData?.bubbles || [];

  const getBubblePosition = (category: string, priceRange: string) => {
    const x = priceRanges.indexOf(priceRange);
    const y = categories.indexOf(category);
    return { x, y };
  };

  if (loading) {
    return (
      <div className="relative h-64 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading heatmap...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex">
        <div className="w-20 pt-8">
          {categories.map((cat) => (
            <div key={cat} className="h-16 flex items-center text-xs text-slate-400">{cat}</div>
          ))}
        </div>
        <div className="flex-1">
          <div className="flex justify-between mb-2">
            {priceRanges.map(range => (
              <div key={range} className="text-xs text-slate-400 text-center flex-1">{range}</div>
            ))}
          </div>
          <div className="relative h-64 bg-slate-800/50 rounded-xl overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0">
              {[0, 1, 2, 3].map(i => (
                <div key={`h-${i}`} className="absolute w-full border-t border-slate-700/30" style={{ top: `${(i + 1) * 25}%` }} />
              ))}
              {[0, 1, 2, 3].map(i => (
                <div key={`v-${i}`} className="absolute h-full border-l border-slate-700/30" style={{ left: `${(i + 1) * 25}%` }} />
              ))}
            </div>
            
            {/* Bubbles */}
            {bubbles.length > 0 ? (
              bubbles.map((bubble, i) => {
                const pos = getBubblePosition(bubble.category, bubble.priceRange);
                const size = bubble.size === 3 ? 32 : bubble.size === 2 ? 24 : 16;
                const intensity = bubble.size === 3 ? 0.8 : bubble.size === 2 ? 0.6 : 0.4;
                
                return (
                  <div
                    key={i}
                    className="absolute rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"
                    style={{
                      left: `${pos.x * 25 + 12.5}%`,
                      top: `${pos.y * 25 + 12.5}%`,
                      width: size,
                      height: size,
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: `rgba(52, 211, 153, ${intensity * 0.4})`,
                      border: `1px solid rgba(52, 211, 153, ${intensity})`,
                      boxShadow: `0 0 ${size}px rgba(52, 211, 153, ${intensity * 0.3})`
                    }}
                    title={`${bubble.category} ${bubble.priceRange}: ${bubble.change > 0 ? '+' : ''}${bubble.change.toFixed(1)}%`}
                  />
                );
              })
            ) : (
              <>
                <div className="absolute rounded-full w-6 h-6 bg-emerald-400/30 border border-emerald-400/60" style={{ left: '37.5%', top: '12.5%', transform: 'translate(-50%, -50%)' }} />
                <div className="absolute rounded-full w-8 h-8 bg-emerald-400/40 border border-emerald-400/70" style={{ left: '62.5%', top: '37.5%', transform: 'translate(-50%, -50%)' }} />
                <div className="absolute rounded-full w-5 h-5 bg-emerald-400/25 border border-emerald-400/50" style={{ left: '87.5%', top: '62.5%', transform: 'translate(-50%, -50%)' }} />
                <div className="absolute rounded-full w-7 h-7 bg-emerald-400/35 border border-emerald-400/65" style={{ left: '37.5%', top: '87.5%', transform: 'translate(-50%, -50%)' }} />
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-4 text-xs">
        <span className="text-slate-400">Volume:</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400/30" />
          <span className="text-slate-400">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400/50" />
          <span className="text-slate-400">Med</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-emerald-400/70" />
          <span className="text-slate-400">High</span>
        </div>
      </div>
    </div>
  );
}
