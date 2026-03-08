import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CryptoCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="mt-1 h-4 w-12" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>

        <Skeleton className="mt-4 h-16 w-full" />

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div>
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-1 h-4 w-20" />
          </div>
          <div className="text-right">
            <Skeleton className="h-3 w-10 ml-auto" />
            <Skeleton className="mt-1 h-4 w-8 ml-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
