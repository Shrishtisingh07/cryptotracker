"use client"

import { use } from "react"
import Link from "next/link"
import Image from "next/image"
import useSWR from "swr"
import { ArrowLeft, Star, TrendingDown, TrendingUp } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { PriceChart } from "@/components/price-chart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getCoinDetail, getCoinChart, formatPrice, formatMarketCap, formatPercentage } from "@/lib/api"
import { useWatchlist } from "@/hooks/use-watchlist"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface CoinDetailPageProps {
  params: Promise<{ id: string }>
}

export default function CoinDetailPage({ params }: CoinDetailPageProps) {
  const { id } = use(params)
  const { isInWatchlist, toggleWatchlist } = useWatchlist()

  const {
    data: coin,
    error: coinError,
    isLoading: coinLoading,
  } = useSWR(`coin-${id}`, () => getCoinDetail(id), {
    revalidateOnFocus: false,
  })

  const {
    data: chartData,
    error: chartError,
    isLoading: chartLoading,
  } = useSWR(`chart-${id}`, () => getCoinChart(id, 7), {
    revalidateOnFocus: false,
  })

  const handleToggleWatchlist = () => {
    toggleWatchlist(id)
    if (isInWatchlist(id)) {
      toast.success(`Removed ${coin?.name || "coin"} from watchlist`)
    } else {
      toast.success(`Added ${coin?.name || "coin"} to watchlist`)
    }
  }

  if (coinError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-border bg-card py-16 text-center">
            <p className="text-lg font-medium text-foreground">
              Unable to load coin data
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              The coin you&apos;re looking for might not exist or there was an error.
            </p>
            <Link href="/">
              <Button className="mt-4">Return Home</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const isPositive = coin?.market_data?.price_change_percentage_24h >= 0

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Coin Header */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {coinLoading ? (
            <CoinHeaderSkeleton />
          ) : coin ? (
            <>
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-secondary">
                  <Image
                    src={coin.image.large}
                    alt={coin.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-foreground">
                      {coin.name}
                    </h1>
                    <span className="rounded-full bg-secondary px-2 py-1 text-sm font-medium text-muted-foreground uppercase">
                      {coin.symbol}
                    </span>
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
                      Rank #{coin.market_data.market_cap_rank}
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-foreground">
                      {formatPrice(coin.market_data.current_price.usd)}
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium",
                        isPositive
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      )}
                    >
                      {isPositive ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {formatPercentage(coin.market_data.price_change_percentage_24h)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant={isInWatchlist(id) ? "default" : "outline"}
                onClick={handleToggleWatchlist}
                className="gap-2"
              >
                <Star
                  className={cn(
                    "h-4 w-4",
                    isInWatchlist(id) && "fill-current"
                  )}
                />
                {isInWatchlist(id) ? "In Watchlist" : "Add to Watchlist"}
              </Button>
            </>
          ) : null}
        </div>

        {/* Chart Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>7-Day Price Chart</CardTitle>
          </CardHeader>
          <CardContent>
            {chartLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : chartError ? (
              <div className="flex h-80 items-center justify-center text-muted-foreground">
                Unable to load chart data
              </div>
            ) : chartData ? (
              <PriceChart data={chartData.prices} isPositive={isPositive} />
            ) : null}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {coinLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-2 h-6 w-32" />
                </CardContent>
              </Card>
            ))
          ) : coin ? (
            <>
              <StatCard
                label="Market Cap"
                value={formatMarketCap(coin.market_data.market_cap.usd)}
              />
              <StatCard
                label="24h Volume"
                value={formatMarketCap(coin.market_data.total_volume.usd)}
              />
              <StatCard
                label="24h High"
                value={formatPrice(coin.market_data.high_24h.usd)}
              />
              <StatCard
                label="24h Low"
                value={formatPrice(coin.market_data.low_24h.usd)}
              />
              <StatCard
                label="7d Change"
                value={formatPercentage(coin.market_data.price_change_percentage_7d)}
                isPercentage
                isPositive={coin.market_data.price_change_percentage_7d >= 0}
              />
              <StatCard
                label="30d Change"
                value={formatPercentage(coin.market_data.price_change_percentage_30d)}
                isPercentage
                isPositive={coin.market_data.price_change_percentage_30d >= 0}
              />
              <StatCard
                label="All-Time High"
                value={formatPrice(coin.market_data.ath.usd)}
              />
              <StatCard
                label="All-Time Low"
                value={formatPrice(coin.market_data.atl.usd)}
              />
            </>
          ) : null}
        </div>

        {/* Supply Info */}
        {coin && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Supply Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Circulating Supply</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {coin.market_data.circulating_supply?.toLocaleString() || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Supply</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {coin.market_data.total_supply?.toLocaleString() || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Max Supply</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {coin.market_data.max_supply?.toLocaleString() || "Unlimited"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Description */}
        {coin?.description?.en && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>About {coin.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm prose-invert max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: coin.description.en.split(". ").slice(0, 3).join(". ") + ".",
                }}
              />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

function CoinHeaderSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="mt-2 flex items-baseline gap-3">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  isPercentage,
  isPositive,
}: {
  label: string
  value: string
  isPercentage?: boolean
  isPositive?: boolean
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p
          className={cn(
            "mt-1 text-lg font-semibold",
            isPercentage
              ? isPositive
                ? "text-success"
                : "text-destructive"
              : "text-foreground"
          )}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  )
}
