import { apiClient } from './api'
import type { ReleaseProduct, ReleaseConfidence, ReleaseSourceType, ReleaseSourceTier, ReleaseStatus } from '../types'
import type { UseReleaseProductsParams } from '../hooks/useReleaseProducts'

interface LegacyReleaseProductsResponse {
  success: boolean
  data: ReleaseProduct[]
}

interface TcgSetsResponse {
  success: boolean
  data: Array<{
    id: string
    provider: string
    providerSetId: string
    name: string
    releaseDate: string | null
    series: string | null
    total: number | null
    images: Record<string, string> | null
    updatedAt: string
  }>
  meta?: {
    asOf?: string | null
    page: number
    perPage: number
    totalCount: number
    totalPages: number
  }
}

interface TcgSetCardsResponse {
  success: boolean
  data: Array<{
    id: string
    provider: string
    providerCardId: string
    name: string
    number: string | null
    rarity: string | null
    images: Record<string, string> | null
    tcgplayerId: string | null
    prices: Array<{
      source: string
      currency: string
      market: number | null
      low: number | null
      mid: number | null
      high: number | null
      directLow: number | null
      updatedAt: string
    }>
    updatedAt: string
  }>
  meta?: {
    asOf?: string | null
    page: number
    perPage: number
    totalCount: number
    totalPages: number
  }
}

export interface ReleaseProductsAdapterResult {
  products: ReleaseProduct[]
  asOf?: string
}

const USE_TCG_DATA_LAYER = String(import.meta.env.VITE_USE_TCG_DATA_LAYER || '').toLowerCase() === 'true'
const TCG_SETS_LIMIT = Number.parseInt(import.meta.env.VITE_TCG_MAX_SETS || '24', 10) || 24
const TCG_CARDS_PER_SET_LIMIT = Number.parseInt(import.meta.env.VITE_TCG_MAX_CARDS_PER_SET || '120', 10) || 120
const TCG_SET_FETCH_CONCURRENCY = Number.parseInt(import.meta.env.VITE_TCG_SET_FETCH_CONCURRENCY || '4', 10) || 4

function deriveStatus(releaseDate?: string): ReleaseStatus {
  if (!releaseDate) return 'announced'
  return new Date(releaseDate).getTime() <= Date.now() ? 'released' : 'official'
}

function deriveSourceType(): ReleaseSourceType {
  return 'official'
}

function deriveConfidence(): ReleaseConfidence {
  return 'confirmed'
}

function deriveConfidenceScore(): number {
  return 88
}

function deriveSourceTier(): ReleaseSourceTier {
  return 'A'
}

function isWithinDateWindow(dateIso: string | null, fromDate?: string, toDate?: string): boolean {
  if (!dateIso) return true
  const value = new Date(dateIso).getTime()
  if (Number.isNaN(value)) return true
  if (fromDate) {
    const min = new Date(fromDate).getTime()
    if (!Number.isNaN(min) && value < min) return false
  }
  if (toDate) {
    const max = new Date(toDate).getTime()
    if (!Number.isNaN(max) && value > max) return false
  }
  return true
}

async function fetchAllPokemonSets(fromDate?: string, toDate?: string): Promise<{ sets: TcgSetsResponse['data']; asOf?: string }> {
  const perPage = 100
  let page = 1
  let totalPages = 1
  const sets: TcgSetsResponse['data'] = []
  let asOf: string | undefined

  while (page <= totalPages) {
    const response = await apiClient.get<TcgSetsResponse>('/tcg/pokemon/sets', {
      params: {
        sort: 'release_date_desc',
        page,
        perPage,
      },
    })
    totalPages = response.data.meta?.totalPages ?? 1
    if (response.data.meta?.asOf) {
      asOf = response.data.meta.asOf
    }
    sets.push(...response.data.data)
    page += 1
  }

  const filtered = sets.filter((set) => isWithinDateWindow(set.releaseDate, fromDate, toDate))
  return { sets: filtered, asOf }
}

async function fetchAllCardsForSet(setId: string): Promise<{ cards: TcgSetCardsResponse['data']; asOf?: string }> {
  const perPage = Math.min(200, Math.max(20, TCG_CARDS_PER_SET_LIMIT))
  const cards: TcgSetCardsResponse['data'] = []
  let asOf: string | undefined

  const response = await apiClient.get<TcgSetCardsResponse>(`/tcg/pokemon/sets/${setId}/cards`, {
    params: { page: 1, perPage },
  })
  if (response.data.meta?.asOf) {
    asOf = response.data.meta.asOf
  }
  cards.push(...response.data.data)

  return { cards, asOf }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const safe = Math.max(1, Math.min(concurrency, items.length || 1))
  const out: R[] = new Array(items.length)
  let cursor = 0

  async function worker() {
    while (cursor < items.length) {
      const current = cursor
      cursor += 1
      out[current] = await mapper(items[current], current)
    }
  }

  await Promise.all(Array.from({ length: safe }, () => worker()))
  return out
}

function mergeAsOf(values: Array<string | undefined>): string | undefined {
  const valid = values.filter((v): v is string => Boolean(v))
  if (valid.length === 0) return undefined
  return valid.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
}

function mapTcgCardToReleaseProduct(
  set: TcgSetsResponse['data'][number],
  card: TcgSetCardsResponse['data'][number],
): ReleaseProduct {
  const bestPrice = card.prices.find((p) => p.market != null || p.mid != null || p.low != null)
  const estimatedResale = bestPrice?.market ?? bestPrice?.mid ?? bestPrice?.low ?? undefined
  const imageUrl = card.images?.small || card.images?.large || set.images?.logo || undefined
  const buyUrl = card.tcgplayerId ? `https://www.tcgplayer.com/product/${card.tcgplayerId}` : undefined

  return {
    id: card.id,
    name: card.number ? `${card.name} #${card.number}` : card.name,
    productType: 'single_card',
    category: 'pokemon',
    msrp: undefined,
    estimatedResale,
    releaseDate: set.releaseDate ?? undefined,
    imageUrl,
    buyUrl,
    sourceUrl: 'https://pokemontcg.io',
    contentsSummary: card.rarity || undefined,
    setName: set.name,
    confidence: deriveConfidence(),
    confidenceScore: deriveConfidenceScore(),
    sourceTier: deriveSourceTier(),
    sourceType: deriveSourceType(),
    status: deriveStatus(set.releaseDate ?? undefined),
  }
}

async function fetchViaTcgDataLayer(params: UseReleaseProductsParams): Promise<ReleaseProductsAdapterResult> {
  const onlyPokemonRequested =
    !params.categories ||
    params.categories.length === 0 ||
    (params.categories.length === 1 && params.categories[0] === 'pokemon')

  if (!onlyPokemonRequested) {
    return fetchViaLegacyReleaseApi(params)
  }

  const { sets, asOf: setsAsOf } = await fetchAllPokemonSets(params.fromDate, params.toDate)
  const selectedSets = sets.slice(0, Math.max(1, TCG_SETS_LIMIT))
  const cardResults = await mapWithConcurrency(
    selectedSets,
    TCG_SET_FETCH_CONCURRENCY,
    async (set) => fetchAllCardsForSet(set.id),
  )

  const products = selectedSets.flatMap((set, index) =>
    cardResults[index].cards.map((card) => mapTcgCardToReleaseProduct(set, card)),
  )
  const asOf = mergeAsOf([setsAsOf, ...cardResults.map((r) => r.asOf)])

  // Guardrail: if TCG layer is reachable but not hydrated yet, avoid blanking Releases UX.
  if (products.length === 0) {
    return fetchViaLegacyReleaseApi(params)
  }

  return { products, asOf }
}

async function fetchViaLegacyReleaseApi(params: UseReleaseProductsParams): Promise<ReleaseProductsAdapterResult> {
  const response = await apiClient.get<LegacyReleaseProductsResponse>('/releases/products', {
    params: {
      fromDate: params.fromDate,
      toDate: params.toDate,
      categories: params.categories && params.categories.length > 0 ? params.categories.join(',') : undefined,
      confidence: params.confidence,
      confidenceBand: params.confidenceBand,
      status: params.status,
      sourceType: params.sourceType,
    },
  })
  return { products: response.data.data }
}

export async function fetchReleaseProducts(params: UseReleaseProductsParams): Promise<ReleaseProductsAdapterResult> {
  if (USE_TCG_DATA_LAYER) {
    try {
      return await fetchViaTcgDataLayer(params)
    } catch (error) {
      console.warn('TCG data layer fetch failed, falling back to legacy releases API', error)
      return fetchViaLegacyReleaseApi(params)
    }
  }
  return fetchViaLegacyReleaseApi(params)
}

