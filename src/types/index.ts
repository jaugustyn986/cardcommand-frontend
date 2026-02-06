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

export interface UpdatePreferencesRequest {
  categories?: string[];
  priceRangeMin?: number;
  priceRangeMax?: number;
  grades?: string[];
  graders?: string[];
  dealAlertThreshold?: number;
  notificationChannels?: string[];
}

export interface CreatePortfolioItemRequest {
  cardName: string;
  cardSet: string;
  year: number;
  grade: string;
  grader?: string;
  currentValue: number;
  purchasePrice: number;
  quantity?: number;
  imageUrl?: string;
  notes?: string;
}

export interface UpdatePortfolioItemRequest {
  currentValue?: number;
  quantity?: number;
  notes?: string;
  inGradingQueue?: boolean;
}

// ============================================
// Filter Types
// ============================================

export interface DealFilters {
  categories?: string[];
  minSavings?: number;
  maxPrice?: number;
  grades?: string[];
  marketplaces?: string[];
  search?: string;
}

export interface PriceHistoryFilters {
  cardName: string;
  cardSet: string;
  year: number;
  grade: string;
  grader?: string;
  days?: number;
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

export interface PortfolioStats {
  totalValue: number;
  totalCost: number;
  totalProfit: number;
  profitPercent: number;
  change24h: number;
  change24hPercent: number;
  change30d: number;
  change
