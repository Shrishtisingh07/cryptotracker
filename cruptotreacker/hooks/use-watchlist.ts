"use client"

import { useState, useEffect, useCallback } from 'react'

const WATCHLIST_KEY = 'crypto-watchlist'

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(WATCHLIST_KEY)
    if (stored) {
      try {
        setWatchlist(JSON.parse(stored))
      } catch {
        setWatchlist([])
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist))
    }
  }, [watchlist, isLoaded])

  const addToWatchlist = useCallback((coinId: string) => {
    setWatchlist((prev) => {
      if (prev.includes(coinId)) return prev
      return [...prev, coinId]
    })
  }, [])

  const removeFromWatchlist = useCallback((coinId: string) => {
    setWatchlist((prev) => prev.filter((id) => id !== coinId))
  }, [])

  const toggleWatchlist = useCallback((coinId: string) => {
    setWatchlist((prev) => {
      if (prev.includes(coinId)) {
        return prev.filter((id) => id !== coinId)
      }
      return [...prev, coinId]
    })
  }, [])

  const isInWatchlist = useCallback(
    (coinId: string) => watchlist.includes(coinId),
    [watchlist]
  )

  return {
    watchlist,
    isLoaded,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    isInWatchlist,
  }
}
