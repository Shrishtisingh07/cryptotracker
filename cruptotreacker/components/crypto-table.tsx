"use client"

import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { SparklineChart } from "@/components/sparkline-chart"
import { CoinMarket } from "@/lib/types"
import { formatPrice, formatMarketCap, formatPercentage } from "@/lib/api"
import { cn } from "@/lib/utils"

interface CryptoTableProps {
  coins: CoinMarket[]
  isLoading: boolean
  isInWatchlist: (coinId: string) => boolean
  onToggleWatchlist: (coinId: string) => void
}

export function CryptoTable({
  coins,
  isLoading,
  isInWatchlist,
  onToggleWatchlist,
}: CryptoTableProps) {
  if (isLoading) {
    return <CryptoTableSkeleton />
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
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/30 hover:bg-secondary/30">
            <TableHead className="w-12"></TableHead>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">24h %</TableHead>
            <TableHead className="text-right hidden md:table-cell">Market Cap</TableHead>
            <TableHead className="w-32 hidden lg:table-cell">7d Chart</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coins.map((coin) => {
            const isPositive = coin.price_change_percentage_24h >= 0

            return (
              <TableRow
                key={coin.id}
                className="group cursor-pointer transition-colors hover:bg-secondary/20"
              >
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleWatchlist(coin.id)
                    }}
                    aria-label={isInWatchlist(coin.id) ? "Remove from watchlist" : "Add to watchlist"}
                  >
                    <Star
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isInWatchlist(coin.id)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground hover:text-primary"
                      )}
                    />
                  </Button>
                </TableCell>
                <TableCell className="font-medium text-muted-foreground">
                  {coin.market_cap_rank}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/coin/${coin.id}`}
                    className="flex items-center gap-3"
                  >
                    <div className="relative h-8 w-8 overflow-hidden rounded-full bg-secondary">
                      <Image
                        src={coin.image}
                        alt={coin.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {coin.name}
                      </span>
                      <span className="ml-2 text-sm text-muted-foreground uppercase">
                        {coin.symbol}
                      </span>
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="text-right font-medium text-foreground">
                  {formatPrice(coin.current_price)}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      "font-medium",
                      isPositive ? "text-success" : "text-destructive"
                    )}
                  >
                    {formatPercentage(coin.price_change_percentage_24h)}
                  </span>
                </TableCell>
                <TableCell className="text-right hidden md:table-cell text-foreground">
                  {formatMarketCap(coin.market_cap)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {coin.sparkline_in_7d && (
                    <div className="h-10 w-full">
                      <SparklineChart
                        data={coin.sparkline_in_7d.price}
                        isPositive={isPositive}
                      />
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

function CryptoTableSkeleton() {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/30 hover:bg-secondary/30">
            <TableHead className="w-12"></TableHead>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">24h %</TableHead>
            <TableHead className="text-right hidden md:table-cell">Market Cap</TableHead>
            <TableHead className="w-32 hidden lg:table-cell">7d Chart</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-8 w-8 rounded-md" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-6" />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-20 ml-auto" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-16 ml-auto" />
              </TableCell>
              <TableCell className="text-right hidden md:table-cell">
                <Skeleton className="h-4 w-20 ml-auto" />
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <Skeleton className="h-10 w-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
