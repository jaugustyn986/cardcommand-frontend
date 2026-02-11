// ============================================
// CardCommand Center - Type Definitions
// ============================================

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
  error?: ApiError;
}

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// ============================================
// Request Body Types
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

// ============================================
// Domain Types
// ============================================

export type Category = 
  | 'basketball' 
  | 'baseball' 
  | 'football' 
  | 'hockey' 
  | 'soccer' 
  | 'pokemon' 
  | 'mtg' 
  | 'yugioh' 
  | 'one_piece' 
  | 'digimon' 
  | 'lorcana';

export type Liquidity = 'High' | 'Medium' | 'Low';

export type Sentiment = 'Bullish' | 'Bearish' | 'Neutral';

export type Plan = 'free' | 'premium' | 'pro';

// ============================================
// Strategy Types
// ============================================

export interface Strategy {
  primary: 'Flip' | 'Short Hold' | 'Long Hold' | 'Avoid' | 'Grade First';
  confidence: number;
  reasoning: string;
  scenarios: StrategyScenario[];
  risks: string[];
  alternatives: string[];
  keyFactors: StrategyFactor[];
}

export interface StrategyScenario {
  timeframe: string;
  projectedReturn: number;
  confidence: number;
  liquidity: 'High' | 'Medium' | 'Low';
}

export interface StrategyFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  detail: string;
}

// ============================================
// Deal Types
// ============================================

export interface Deal {
  id: string;
  cardName: string;
  cardSet: string;
  year: number;
  cardNumber?: string;
  variation?: string;
  grade: string;
  grader?: string;
  marketPrice: number;
  dealPrice: number;
  savingsPercent: number;
  savingsAmount: number;
  marketplace: string;
  sellerRating: number;
  sellerFeedback: number;
  listingUrl: string;
  imageUrl?: string;
  category: Category;
  liquidity: Liquidity;
  lastSoldPrice?: number;
  thirtyDayAvg?: number;
  ninetyDayTrend?: number;
  popGraded?: number;
  popGrade10?: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  strategy?: Strategy;
}

// ============================================
// Portfolio Types
// ============================================

export interface PortfolioItem {
  id: string;
  cardName: string;
  cardSet: string;
  year: number;
  grade: string;
  grader?: string;
  currentValue: number;
  purchasePrice: number;
  purchaseDate: string;
  quantity: number;
  imageUrl?: string;
  notes?: string;
  inGradingQueue: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Trending Types
// ============================================

export interface TrendingItem {
  id: string;
  cardName: string;
  cardSet: string;
  category: Category;
  currentPrice: number;
  priceChange24h: number;
  priceChange7d: number;
  priceChange30d: number;
  volumeIncrease: number;
  searchVolume: number;
  sentiment: Sentiment;
  calculatedAt: string;
}

// ============================================
// Release Types
// ============================================

export interface Release {
  id: string;
  name: string;
  releaseDate: string;
  category: Category;
  manufacturer: string;
  msrp: number;
  estimatedResale?: number;
  hypeScore?: number;
  imageUrl?: string;
  topChases: string[];
  printRun?: string;
  description?: string;
  isReleased: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ReleaseConfidence = 'confirmed' | 'unconfirmed' | 'rumor'

export interface ReleaseProductStrategy {
  primary: 'Flip' | 'Short Hold' | 'Long Hold' | 'Avoid' | 'Watch'
  confidence: number
  reasonSummary: string
  keyFactors?: {
    factor: string
    impact: 'positive' | 'negative' | 'neutral'
    detail: string
  }[]
}

export interface ReleaseProduct {
  id: string;
  name: string;
  productType: string;
  category: Category;
  msrp?: number;
  estimatedResale?: number;
  releaseDate?: string;
  preorderDate?: string;
  imageUrl?: string;
  buyUrl?: string;
  contentsSummary?: string;
  sourceUrl?: string;
  setName: string;
  setHypeScore?: number;
  confidence?: ReleaseConfidence;
  strategy?: ReleaseProductStrategy;
}

// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  email: string;
  name?: string;
  plan: Plan;
  createdAt: string;
}
