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
              className
