import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import DealCard from './components/DealCard'
import PortfolioCard from './components/PortfolioCard'
import ReleaseProductCard from './components/ReleaseProductCard'
import Heatmap from './components/Heatmap'
import AuthModal from './components/modals/AuthModal'
import StrategyModal from './components/modals/StrategyModal'
import { useDeals } from './hooks/useDeals'
import { usePortfolio } from './hooks/usePortfolio'
import { useTrending } from './hooks/useTrending'
import { useReleaseProducts, type UseReleaseProductsParams } from './hooks/useReleaseProducts'
import { useReleaseChanges } from './hooks/useReleaseChanges'
import { useSyncReleases } from './hooks/useSyncReleases'
import { useAuth } from './contexts/AuthContext'
import { mockTrending } from './data/mockData'
import type { Deal, Category } from './types'

const queryClient = new QueryClient()

function AppContent() {
  const [activeTab, setActiveTab] = useState<'deals' | 'portfolio' | 'trending' | 'releases'>('deals')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [releasesFilterOpen, setReleasesFilterOpen] = useState(false)

  // Default releases window: past 1 month to next 3 months
  const now = new Date()
  const defaultFrom = new Date(now)
  defaultFrom.setMonth(defaultFrom.getMonth() - 1)
  const defaultTo = new Date(now)
  defaultTo.setMonth(defaultTo.getMonth() + 3)

  const formatDateInput = (date: Date) => date.toISOString().slice(0, 10)

  const [releaseFromDate, setReleaseFromDate] = useState<string>(formatDateInput(defaultFrom))
  const [releaseToDate, setReleaseToDate] = useState<string>(formatDateInput(defaultTo))
  const [releaseCategories, setReleaseCategories] = useState<Category[]>([])

  const { user } = useAuth()
  const { data: deals, isLoading: dealsLoading, error: dealsError } = useDeals()
  const { data: portfolio, isLoading: portfolioLoading, error: portfolioError } = usePortfolio()
  const { data: trending, isLoading: trendingLoading, error: trendingError } = useTrending()
  const releaseProductsParams: UseReleaseProductsParams = {
    fromDate: releaseFromDate,
    toDate: releaseToDate,
    categories: releaseCategories,
  }

  const {
    data: releaseProducts,
    isLoading: releasesLoading,
    error: releasesError,
  } = useReleaseProducts(releaseProductsParams)
  const { data: releaseChanges } = useReleaseChanges({ limit: 8 })
  const { mutate: syncReleases, isPending: isSyncing } = useSyncReleases()

  const displayDeals = deals ?? []
  const displayPortfolio = portfolio ?? []
  const displayTrending = (trending && trending.length > 0) ? trending : mockTrending
  const displayReleaseProducts = releaseProducts ?? []

  const ALL_RELEASE_CATEGORIES: { value: Category; label: string }[] = [
    { value: 'pokemon', label: 'Pokémon TCG' },
    { value: 'mtg', label: 'Magic: The Gathering' },
    { value: 'yugioh', label: 'Yu-Gi-Oh!' },
    { value: 'one_piece', label: 'One Piece' },
    { value: 'lorcana', label: 'Lorcana' },
    { value: 'digimon', label: 'Digimon' },
    { value: 'basketball', label: 'Basketball' },
    { value: 'football', label: 'Football' },
    { value: 'baseball', label: 'Baseball' },
    { value: 'soccer', label: 'Soccer' },
    { value: 'hockey', label: 'Hockey' },
  ]

  const toggleReleaseCategory = (category: Category) => {
    setReleaseCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const releaseCategoryLabel =
    releaseCategories.length === 0
      ? 'All games'
      : `${releaseCategories.length} game${releaseCategories.length > 1 ? 's' : ''} selected`

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar 
        onLoginClick={() => { setAuthMode('login'); setShowAuthModal(true) }}
        onRegisterClick={() => { setAuthMode('register'); setShowAuthModal(true) }}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-slate-800 pb-4">
          {(['deals', 'portfolio', 'trending', 'releases'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Deals Tab */}
        {activeTab === 'deals' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {dealsLoading && (
              <div className="col-span-full text-center py-12 text-slate-400">Loading deals...</div>
            )}
            {!dealsLoading && dealsError && (
              <div className="col-span-full text-center py-12 text-rose-400">
                Failed to load deals. Please try again.
              </div>
            )}
            {!dealsLoading && !dealsError && displayDeals.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-400">
                No deals found. Check back soon.
              </div>
            )}
            {!dealsLoading &&
              !dealsError &&
              displayDeals.length > 0 &&
              displayDeals.map((deal: Deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onClick={() => setSelectedDeal(deal)}
                />
              ))}
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioLoading && (
              <div className="col-span-full text-center py-12 text-slate-400">Loading portfolio...</div>
            )}
            {!portfolioLoading && portfolioError && (
              <div className="col-span-full text-center py-12 text-rose-400">
                Failed to load your portfolio. Please sign in and try again.
              </div>
            )}
            {!portfolioLoading && !portfolioError && displayPortfolio.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-400">
                Your portfolio is empty. Add your first card to start tracking value.
              </div>
            )}
            {!portfolioLoading &&
              !portfolioError &&
              displayPortfolio.length > 0 &&
              displayPortfolio.map((item) => (
                <PortfolioCard key={item.id} item={item} />
              ))}
          </div>
        )}

        {/* Trending Tab */}
        {activeTab === 'trending' && (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left content - Top Risers */}
            <div className="lg:col-span-4">
              <h2 className="text-4xl font-bold mb-2">
                SEE WHAT'S<br />
                <span className="text-emerald-400">HEATING UP</span>
              </h2>
              <p className="text-slate-400 mb-8">
                Heatmaps, velocity scores, and social sentiment—so you know what to buy, sell, or hold.
              </p>
              
              {/* Trending list */}
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wider text-slate-500">TOP RISERS (24H)</p>
                
                {trendingLoading && (
                  <div className="text-center py-12 text-slate-400">Loading...</div>
                )}
                {!trendingLoading && trendingError && (
                  <div className="text-center py-12 text-rose-400">
                    Failed to load trending cards. Showing sample data.
                  </div>
                )}
                {!trendingLoading &&
                  displayTrending.slice(0, 4).map((item: any) => (
                    <div
                      key={item.id}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-emerald-500/30 transition-all cursor-pointer"
                    >
                      <div>
                        <p className="font-medium text-white">{item.cardName}</p>
                        <p className="text-sm text-slate-400">{item.cardSet}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-white">${item.currentPrice.toLocaleString()}</p>
                        <p
                          className={`text-sm flex items-center gap-1 ${
                            item.priceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {item.priceChange24h >= 0 ? '↗' : '↘'}
                          {item.priceChange24h >= 0 ? '+' : ''}
                          {item.priceChange24h.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
              
              <button className="mt-6 text-emerald-400 font-medium flex items-center gap-2 hover:gap-3 transition-all">
                ↗ Explore trends
                <span>›</span>
              </button>
            </div>
            
            {/* Right heatmap */}
            <div className="lg:col-span-8">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="font-semibold mb-6 flex items-center gap-2 text-white">
                  <span className="text-emerald-400">📊</span>
                  Market Heatmap
                </h3>
                <Heatmap />
              </div>
            </div>
          </div>
        )}

        {/* Releases Tab */}
        {activeTab === 'releases' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              {/* Left: filters */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Date range */}
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <span className="text-slate-400">Releases between</span>
                  <input
                    type="date"
                    value={releaseFromDate}
                    onChange={(e) => setReleaseFromDate(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500">and</span>
                  <input
                    type="date"
                    value={releaseToDate}
                    onChange={(e) => setReleaseToDate(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Category multi-select */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setReleasesFilterOpen((open) => !open)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-700 bg-slate-900 text-xs sm:text-sm text-slate-200 hover:border-emerald-500/60 hover:text-white transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{releaseCategoryLabel}</span>
                    <span className="text-slate-500 text-xs">▼</span>
                  </button>

                  {releasesFilterOpen && (
                    <div className="absolute z-20 mt-2 w-56 rounded-lg border border-slate-800 bg-slate-900 shadow-xl">
                      <div className="max-h-64 overflow-y-auto p-2">
                        {ALL_RELEASE_CATEGORIES.map((cat) => {
                          const active = releaseCategories.includes(cat.value)
                          return (
                            <button
                              key={cat.value}
                              type="button"
                              onClick={() => toggleReleaseCategory(cat.value)}
                              className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs sm:text-sm ${
                                active
                                  ? 'bg-emerald-500/10 text-emerald-300'
                                  : 'text-slate-200 hover:bg-slate-800'
                              }`}
                            >
                              <span>{cat.label}</span>
                              <span
                                className={`inline-flex h-4 w-4 items-center justify-center rounded border ${
                                  active
                                    ? 'border-emerald-400 bg-emerald-500/80 text-slate-950'
                                    : 'border-slate-600 text-transparent'
                                }`}
                              >
                                ✓
                              </span>
                            </button>
                          )
                        })}
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-800 px-2 py-1.5">
                        <button
                          type="button"
                          onClick={() => setReleaseCategories([])}
                          className="text-xs text-slate-400 hover:text-slate-200"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={() => setReleasesFilterOpen(false)}
                          className="text-xs text-emerald-400 hover:text-emerald-300"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: sync button */}
              <button
                onClick={() => (user ? syncReleases() : setShowAuthModal(true))}
                disabled={isSyncing || !user}
                className="px-4 py-2 rounded-lg font-medium bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-sm transition-colors w-full sm:w-auto"
              >
                {isSyncing ? 'Syncing...' : user ? 'Sync releases' : 'Sign in to sync'}
              </button>
            </div>

            {/* What changed */}
            {releaseChanges && releaseChanges.length > 0 && (
              <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <span className="text-amber-400">↻</span>
                  Recent changes
                </h3>
                <ul className="space-y-2">
                  {releaseChanges.slice(0, 6).map((c) => (
                    <li key={c.id} className="text-xs text-slate-300 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="font-medium text-slate-200 capitalize">{c.field.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className="text-slate-400">{c.setName}</span>
                      {c.productName !== c.setName && <span className="text-slate-500 truncate">{c.productName}</span>}
                      <span>
                        {c.oldValue ? <span className="line-through text-slate-500">{c.oldValue}</span> : null}
                        {c.oldValue && c.newValue ? ' → ' : ''}
                        {c.newValue ? <span className="text-emerald-400">{c.newValue}</span> : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {releasesLoading && (
                <div className="col-span-full text-center py-12 text-slate-400">Loading releases...</div>
              )}
              {!releasesLoading && releasesError && (
                <div className="col-span-full text-center py-12 text-rose-400">
                  Failed to load releases. Please try again.
                </div>
              )}
              {!releasesLoading && !releasesError && displayReleaseProducts.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-400">
                  No releases in this window. Check back later or try a different filter.
                </div>
              )}
              {!releasesLoading &&
                !releasesError &&
                displayReleaseProducts.length > 0 &&
                displayReleaseProducts.map((product) => (
                  <ReleaseProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showAuthModal && (
        <AuthModal 
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
        />
      )}

      {selectedDeal && (
        <StrategyModal 
          deal={selectedDeal}
          onClose={() => setSelectedDeal(null)}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
