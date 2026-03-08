"use client"

import { Star } from "lucide-react"
import { CryptoGrid } from "@/components/crypto-grid"
import { CryptoTable } from "@/components/crypto-table"
import { CoinMarket } from "@/lib/types"

interface WatchlistSectionProps {
  coins: CoinMarket[]
  isLoading: boolean
  viewMode: "grid" | "table"
  isInWatchlist: (coinId: string) => boolean
  onToggleWatchlist: (coinId: string) => void
}

export function WatchlistSection({
  coins,
  isLoading,
  viewMode,
  isInWatchlist,
  onToggleWatchlist,
}: WatchlistSectionProps) {
  if (!isLoading && coins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <Star className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-foreground">
          Your watchlist is empty
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Click the star icon on any coin to add it to your watchlist for quick access
        </p>
      </div>
    )
  }

  if (viewMode === "grid") {
    return (
      <CryptoGrid
        coins={coins}
        isLoading={isLoading}
        isInWatchlist={isInWatchlist}
        onToggleWatchlist={onToggleWatchlist}
      />
    )
  }

  return (
    <CryptoTable
      coins={coins}
      isLoading={isLoading}
      isInWatchlist={isInWatchlist}
      onToggleWatchlist={onToggleWatchlist}
    />
  )
}
