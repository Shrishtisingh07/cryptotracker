"use client"

import { CryptoCard } from "@/components/crypto-card"
import { CryptoCardSkeleton } from "@/components/crypto-card-skeleton"
import { CoinMarket } from "@/lib/types"

interface CryptoGridProps {
  coins: CoinMarket[]
  isLoading: boolean
  isInWatchlist: (coinId: string) => boolean
  onToggleWatchlist: (coinId: string) => void
}

export function CryptoGrid({
  coins,
  isLoading,
  isInWatchlist,
  onToggleWatchlist,
}: CryptoGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CryptoCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (coins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-foreground">No coins found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your search or check back later
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {coins.map((coin) => (
        <CryptoCard
          key={coin.id}
          coin={coin}
          isInWatchlist={isInWatchlist(coin.id)}
          onToggleWatchlist={onToggleWatchlist}
        />
      ))}
    </div>
  )
}
