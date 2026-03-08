"use client"

import { useEffect } from "react"
import useSWR from "swr"
import { LayoutGrid, List, RefreshCw } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { CryptoGrid } from "@/components/crypto-grid"
import { CryptoTable } from "@/components/crypto-table"
import { WatchlistSection } from "@/components/watchlist-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { getTopCoins } from "@/lib/api"
import { useWatchlist } from "@/hooks/use-watchlist"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("table")
  const { watchlist, isLoaded, isInWatchlist, toggleWatchlist } = useWatchlist()

  const {
    data: coins,
    error,
    isLoading,
    mutate,
    isValidating,
  } = useSWR("top-coins", () => getTopCoins(1, 20), {
    refreshInterval: 60000, // Refresh every minute
    revalidateOnFocus: false,
  })

  // Auto-refresh indicator
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    if (coins && !isValidating) {
      setLastUpdated(new Date())
    }
  }, [coins, isValidating])

  const watchlistCoins = coins?.filter((coin) => watchlist.includes(coin.id)) || []

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Cryptocurrency Prices
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track live prices of the top 20 cryptocurrencies by market cap
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Coins"
            value={coins?.length.toString() || "0"}
          />
          <StatCard
            label="Watchlist"
            value={watchlistCoins.length.toString()}
          />
          <StatCard
            label="Last Updated"
            value={
              lastUpdated
                ? lastUpdated.toLocaleTimeString()
                : "Loading..."
            }
          />
          <StatCard
            label="Status"
            value={isValidating ? "Updating..." : "Live"}
            valueClassName={isValidating ? "text-primary" : "text-success"}
          />
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList>
              <TabsTrigger value="all">All Coins</TabsTrigger>
              <TabsTrigger value="watchlist">
                Watchlist
                {watchlistCoins.length > 0 && (
                  <span className="ml-2 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                    {watchlistCoins.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => mutate()}
                disabled={isValidating}
                className="gap-2"
              >
                <RefreshCw
                  className={cn("h-4 w-4", isValidating && "animate-spin")}
                />
                Refresh
              </Button>

              <div className="flex items-center rounded-lg border border-border p-1">
                <Button
                  variant={viewMode === "table" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="h-8 w-8 p-0"
                  aria-label="Table view"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="all" className="mt-6">
            {error ? (
              <ErrorState onRetry={() => mutate()} />
            ) : viewMode === "grid" ? (
              <CryptoGrid
                coins={coins || []}
                isLoading={isLoading}
                isInWatchlist={isInWatchlist}
                onToggleWatchlist={toggleWatchlist}
              />
            ) : (
              <CryptoTable
                coins={coins || []}
                isLoading={isLoading}
                isInWatchlist={isInWatchlist}
                onToggleWatchlist={toggleWatchlist}
              />
            )}
          </TabsContent>

          <TabsContent value="watchlist" className="mt-6">
            <WatchlistSection
              coins={watchlistCoins}
              isLoading={isLoading && !isLoaded}
              viewMode={viewMode}
              isInWatchlist={isInWatchlist}
              onToggleWatchlist={toggleWatchlist}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function StatCard({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-2xl font-semibold text-foreground", valueClassName)}>
        {value}
      </p>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-16 text-center">
      <p className="text-lg font-medium text-foreground">
        Unable to load cryptocurrency data
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        There was an error fetching the latest prices. Please try again.
      </p>
      <Button onClick={onRetry} className="mt-4">
        Try Again
      </Button>
    </div>
  )
}
