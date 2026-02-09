import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import DealCard from './components/DealCard'
import PortfolioCard from './components/PortfolioCard'
import ReleaseCard from './components/ReleaseCard'
import Heatmap from './components/Heatmap'
import AuthModal from './components/modals/AuthModal'
import StrategyModal from './components/modals/StrategyModal'
import { useDeals } from './hooks/useDeals'
import { usePortfolio } from './hooks/usePortfolio'
import { useTrending } from './hooks/useTrending'
import { useReleases } from './hooks/useReleases'
import { mockTrending } from './data/mockData'
import type { Deal } from './types'

const queryClient = new QueryClient()

function AppContent() {
  const [activeTab, setActiveTab] = useState<'deals' | 'portfolio' | 'trending' | 'releases'>('deals')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  const { data: deals, isLoading: dealsLoading, error: dealsError } = useDeals()
  const { data: portfolio, isLoading: portfolioLoading, error: portfolioError } = usePortfolio()
  const { data: trending, isLoading: trendingLoading, error: trendingError } = useTrending()
  const { data: releases, isLoading: releasesLoading, error: releasesError } = useReleases()

  const displayDeals = deals ?? []
  const displayPortfolio = portfolio ?? []
  const displayTrending = (trending && trending.length > 0) ? trending : mockTrending
  const displayReleases = releases ?? []

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {releasesLoading && (
              <div className="col-span-full text-center py-12 text-slate-400">Loading releases...</div>
            )}
            {!releasesLoading && releasesError && (
              <div className="col-span-full text-center py-12 text-rose-400">
                Failed to load releases. Please try again.
              </div>
            )}
            {!releasesLoading && !releasesError && displayReleases.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-400">
                No upcoming releases found.
              </div>
            )}
            {!releasesLoading &&
              !releasesError &&
              displayReleases.length > 0 &&
              displayReleases.map((release) => (
                <ReleaseCard key={release.id} release={release} />
              ))}
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
