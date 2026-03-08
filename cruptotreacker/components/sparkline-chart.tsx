"use client"

import { useMemo } from "react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts"

interface SparklineChartProps {
  data: number[]
  isPositive: boolean
}

export function SparklineChart({ data, isPositive }: SparklineChartProps) {
  const chartData = useMemo(() => {
    // Sample the data to reduce points for performance
    const step = Math.max(1, Math.floor(data.length / 50))
    return data
      .filter((_, i) => i % step === 0)
      .map((price, index) => ({
        index,
        price,
      }))
  }, [data])

  const color = isPositive ? "var(--success)" : "var(--destructive)"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id={`gradient-${isPositive ? "up" : "down"}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#gradient-${isPositive ? "up" : "down"})`}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
