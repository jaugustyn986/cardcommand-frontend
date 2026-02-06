import type { Deal, PortfolioItem, TrendingItem, Release, Strategy } from '../types';

// ============================================
// Mock Strategy Data
// ============================================

const createMockStrategy = (type: 'flip' | 'hold' | 'avoid' | 'grade'): Strategy => {
  const strategies: Record<string, Strategy> = {
    flip: {
      primary: 'Flip',
      confidence: 87,
      reasoning: 'Strong liquidity with 15% below market. Quick 10-15% flip potential within 30 days.',
      scenarios: [
        { timeframe: '7 days', projectedReturn: 8, confidence: 75, liquidity: 'High' },
        { timeframe: '30 days', projectedReturn: 15, confidence: 87, liquidity: 'High' },
        { timeframe: '90 days', projectedReturn: 22, confidence: 65, liquidity: 'Medium' },
      ],
      risks: ['Market saturation from recent reprints', 'Grade crossover potential reducing PSA 10 premium'],
      alternatives: ['Hold for 6 months if pop report shows <500 PSA 10s', 'Cross to BGS 9.5 for potential premium'],
      keyFactors: [
        { factor: 'Price Gap', impact: 'positive', detail: '15% below 30-day average' },
        { factor: 'Seller Rating', impact: 'positive', detail: '99.2% positive feedback' },
        { factor: 'Liquidity', impact: 'positive', detail: 'High - 45 sales in last 30 days' },
      ],
    },
    hold: {
      primary: 'Short Hold',
      confidence: 78,
      reasoning: 'Moderate discount with strong long-term appreciation potential. Hold 3-6 months.',
      scenarios: [
        { timeframe: '30 days', projectedReturn: 5, confidence: 70, liquidity: 'High' },
        { timeframe: '90 days', projectedReturn: 18, confidence: 78, liquidity: 'Medium' },
        { timeframe: '6 months', projectedReturn: 35, confidence: 72, liquidity: 'Medium' },
      ],
      risks: ['Seasonal demand fluctuations', 'New set releases may divert attention'],
      alternatives: ['Flip immediately for guaranteed 8% return', 'Grade raw copies if available cheap'],
      keyFactors: [
        { factor: 'Trend', impact: 'positive', detail: '+12% over 90 days' },
        { factor: 'Pop Report', impact: 'neutral', detail: '1,247 PSA 10s - moderate scarcity' },
        { factor: 'Seasonality', impact: 'positive', detail: 'Basketball season boost incoming' },
      ],
    },
    avoid: {
      primary: 'Avoid',
      confidence: 82,
      reasoning: 'Price too close to market with high competition. Better deals available.',
      scenarios: [
        { timeframe: '30 days', projectedReturn: 2, confidence: 60, liquidity: 'High' },
        { timeframe: '90 days', projectedReturn: 5, confidence: 55, liquidity: 'High' },
      ],
      risks: ['Thin margins make flip risky', 'High seller competition'],
      alternatives: ['Wait for 20%+ discount deal', 'Consider ungraded version for grading arbitrage'],
      keyFactors: [
        { factor: 'Price Gap', impact: 'negative', detail: 'Only 5% below market' },
        { factor: 'Competition', impact: 'negative', detail: '12 similar listings' },
        { factor: 'Trend', impact: 'neutral', detail: 'Flat over 30 days' },
      ],
    },
    grade: {
      primary: 'Grade First',
      confidence: 91,
      reasoning: 'Raw card at PSA 8 price. High upside if grades 9 or 10.',
      scenarios: [
        { timeframe: 'Grade + 30 days', projectedReturn: 45, confidence: 65, liquidity: 'Medium' },
        { timeframe: 'Grade + 90 days', projectedReturn: 120, confidence: 45, liquidity: 'Medium' },
      ],
      risks: ['Grading risk - may come back PSA 8', '3-4 month grading turnaround'],
      alternatives: ['Sell raw for quick 15% profit', 'Submit to BGS for potential black label'],
      keyFactors: [
        { factor: 'Grade Potential', impact: 'positive', detail: 'Centering looks 60/40, good corners' },
        { factor: 'Price Gap', impact: 'positive', detail: 'PSA 10 is 4x current price' },
        { factor: 'Grading Cost', impact: 'neutral', detail: '$50 + 4 month wait' },
      ],
    },
  };

  return strategies[type];
};

// ============================================
// Mock Deals
// ============================================

export const mockDeals: Deal[] = [
