"use client"

import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SparklineChart } from "@/components/sparkline-chart"
import { CoinMarket } from "@/lib/types"
import { formatPrice, formatMarketCap, formatPercentage } from "@/lib/api"
import { cn } from "@/lib/utils"

interface CryptoCardProps {
  coin: CoinMarket
  isInWatchlist: boolean
  onToggleWatchlist: (coinId: string) => void
}

export function CryptoCard({ coin, isInWatchlist, onToggleWatchlist }: CryptoCardProps) {
  const isPositive = coin.price_change_percentage_24h >= 0

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <Link href={`/coin/${coin.id}`} className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-secondary">
              <Image
                src={coin.image}
                alt={coin.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {coin.name}
              </h3>
              <p className="text-sm text-muted-foreground uppercase">
                {coin.symbol}
              </p>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={(e) => {
              e.preventDefault()
              onToggleWatchlist(coin.id)
            }}
            aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
          >
            <Star
              className={cn(
                "h-4 w-4 transition-colors",
                isInWatchlist
                  ? "fill-primary text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            />
          </Button>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">
              {formatPrice(coin.current_price)}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-sm font-medium",
                isPositive
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {formatPercentage(coin.price_change_percentage_24h)}
            </span>
          </div>
        </div>

        {coin.sparkline_in_7d && (
          <div className="mt-4 h-16">
            <SparklineChart
              data={coin.sparkline_in_7d.price}
              isPositive={isPositive}
            />
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Market Cap</p>
            <p className="text-sm font-medium text-foreground">
              {formatMarketCap(coin.market_cap)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Rank</p>
            <p className="text-sm font-medium text-foreground">
              #{coin.market_cap_rank}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
