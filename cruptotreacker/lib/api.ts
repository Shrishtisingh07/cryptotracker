import { CoinMarket, CoinDetail, ChartData, SearchResult } from './types'

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'

// Cache for API responses
const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_DURATION = 60 * 1000 // 1 minute

async function fetchWithCache<T>(url: string, cacheKey: string): Promise<T> {
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  const data = await response.json()
  cache.set(cacheKey, { data, timestamp: Date.now() })
  return data
}

export async function getTopCoins(page = 1, perPage = 20): Promise<CoinMarket[]> {
  const url = `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=24h`
  return fetchWithCache<CoinMarket[]>(url, `top-coins-${page}-${perPage}`)
}

export async function getCoinDetail(id: string): Promise<CoinDetail> {
  const url = `${COINGECKO_BASE_URL}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`
  return fetchWithCache<CoinDetail>(url, `coin-detail-${id}`)
}

export async function getCoinChart(id: string, days = 7): Promise<ChartData> {
  const url = `${COINGECKO_BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
  return fetchWithCache<ChartData>(url, `coin-chart-${id}-${days}`)
}

export async function searchCoins(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []
  const url = `${COINGECKO_BASE_URL}/search?query=${encodeURIComponent(query)}`
  const data = await fetchWithCache<{ coins: SearchResult[] }>(url, `search-${query}`)
  return data.coins.slice(0, 10)
}

export function formatPrice(price: number): string {
  if (price >= 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(price)
}

export function formatMarketCap(value: number): string {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`
  }
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  }
  return `$${value.toLocaleString()}`
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}
