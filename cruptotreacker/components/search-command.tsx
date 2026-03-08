"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { searchCoins } from "@/lib/api"
import { SearchResult } from "@/lib/types"
import { useDebounce } from "@/hooks/use-debounce"
import Image from "next/image"

export function SearchCommand() {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    async function search() {
      if (!debouncedQuery.trim()) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const data = await searchCoins(debouncedQuery)
        setResults(data)
      } catch (error) {
        console.error("Search error:", error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    search()
  }, [debouncedQuery])

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (coinId: string) => {
    setQuery("")
    setIsOpen(false)
    router.push(`/coin/${coinId}`)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search coins..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="h-10 w-full pl-10 pr-10 bg-secondary/50"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {isOpen && query.trim() && (
        <div className="absolute top-full mt-2 w-full rounded-lg border border-border bg-popover p-1 shadow-lg">
          {results.length === 0 && !isLoading ? (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              No results found
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {results.map((coin) => (
                <li key={coin.id}>
                  <button
                    onClick={() => handleSelect(coin.id)}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-accent/20"
                  >
                    <Image
                      src={coin.thumb}
                      alt={coin.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {coin.name}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase">
                        {coin.symbol}
                      </p>
                    </div>
                    {coin.market_cap_rank && (
                      <span className="text-xs text-muted-foreground">
                        #{coin.market_cap_rank}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
