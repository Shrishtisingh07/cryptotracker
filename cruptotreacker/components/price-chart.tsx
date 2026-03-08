"use client"

import { useMemo } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { formatPrice } from "@/lib/api"

interface PriceChartProps {
  data: [number, number][]
  isPositive: boolean
}

export function PriceChart({ data, isPositive }: PriceChartProps) {
  const chartData = useMemo(() => {
    return data.map(([timestamp, price]) => ({
      date: new Date(timestamp),
      price,
    }))
  }, [data])

  const color = isPositive ? "var(--success)" : "var(--destructive)"

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            minTickGap={50}
          />
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(value) => formatPrice(value)}
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={80}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(data.date)} at {formatTime(data.date)}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {formatPrice(data.price)}
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            fill="url(#chartGradient)"
            isAnimationActive={true}
            animationDuration={750}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
