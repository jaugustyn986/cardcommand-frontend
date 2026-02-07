import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import DealCard from './components/DealCard'
import PortfolioCard from './components/PortfolioCard'
import TrendingCard from './components/TrendingCard'
import ReleaseCard from './components/ReleaseCard'
import Heatmap from './components/Heatmap'
import AuthModal from './components/modals/AuthModal'
import StrategyModal from './components/modals/StrategyModal'
import { useDeals } from './hooks/useDeals'
import { usePortfolio } from './hooks/usePortfolio'
import { useTrending } from './hooks/useTrending'
import { useReleases } from './hooks/useReleases'
import { mockDeals, mockPortfolio, mockTrending, mockReleases } from './data/mockData'
import type { Deal } from './types'

const queryClient = new QueryClient()

function AppContent() {
  const [activeTab, setActiveTab] = useState<'deals' | 'portfolio' | 'trending' | 'releases'>('deals')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  const { data: deals, isLoading: dealsLoading } = useDeals()
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolio()
  const { data: trending, isLoading: trendingLoading } = useTrending()
  const { data: releases, isLoading: releasesLoading } = useReleases()

  const displayDeals = deals || mockDeals
  const displayPortfolio = portfolio || mockPortfolio
  const displayTrending = trending || mockTrending
  const displayReleases = releases || mockReleases

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
            {dealsLoading ? (
              <div className="col-span-full text-center py-12 text-slate-400">Loading deals...</div>
            ) : (
              displayDeals.map((deal) => (
                <DealCard 
                  key={deal.id} 
                  deal={deal} 
                  onClick={() => setSelectedDeal(deal)}
                />
              ))
            )}
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioLoading ? (
              <div className="col-span-full text-center py-12 text-slate-400">Loading portfolio...</div>
            ) : (
              displayPortfolio.map((item) => (
                <PortfolioCard key={item.id} item={item} />
              ))
            )}
          </div>
        )}

        {/* Trending Tab */}
        {activeTab === 'trending' && (
          <div>
            <div className="mb-8">
              <Heatmap />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingLoading ? (
                <div className="col-span-full text-center py-12 text-slate-400">Loading trending...</div>
              ) : (
                displayTrending.map((item) => (
                  <TrendingCard key={item.id} item={item} />
                ))
              )}
            </div>
          </div>
        )}

        {/* Releases Tab */}
        {activeTab === 'releases' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {releasesLoading ? (
              <div className="col-span-full text-center py-12 text-slate-400">Loading releases...</div>
            ) : (
              displayReleases.map((release) => (
                <ReleaseCard key={release.id} release={release} />
              ))
            )}
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
