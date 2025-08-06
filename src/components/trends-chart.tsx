"use client"

import { useState } from "react"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/ui/chart"
import { HistoricalData } from '@/lib/api'

interface TrendsChartProps {
  data:HistoricalData[]
  pollutant: "aqi" | "pm25" | "pm10"
  pollutantLabel: string
  pollutantUnit: string
}

const DURATIONS = [7, 14, 30]

export default function TrendsChart({
  data,
  pollutant,
  pollutantLabel,
  pollutantUnit,
}: TrendsChartProps) {
  const [duration, setDuration] = useState<number>(30)

  console.log('data at the trends-chart.tsx', data, pollutant, pollutantLabel, pollutantUnit)

  const filteredData = data
    .slice(-duration)
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: item.avg_aqi,
      fullDate: item.date,
    }))

    console.log('filteredData')
    console.log(filteredData)

  const getChartColor = () => {
    switch (pollutant) {
      case "aqi":
        return "#3b82f6" // Blue
      case "pm25":
        return "#ef4444" // Red
      case "pm10":
        return "#f59e0b" // Orange
      default:
        return "#3b82f6"
    }
  }

  return (
    <div className="w-full h-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h4 className="text-[#101828] font-medium">
            {/* {pollutantLabel} Trends - {data} */}
          </h4>
                {/* Duration selector */}
        <select
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="text-sm border rounded px-2 py-1 mt-2 text-[#101828] bg-white cursor-pointer"
        >
          {DURATIONS.map((d) => (
            <option key={d} value={d}>
              Last {d} days
            </option>
          ))}
        </select>
        </div>

  
      </div>

      <div className="w-full h-[300px] sm:h-[350px] lg:h-[400px]">
        <ChartContainer
          config={{
            value: {
              label: pollutantLabel,
              color: getChartColor(),
            },
          }}
          className="w-full h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eaecf0" />
              <XAxis
                dataKey="date"
                stroke="#667085"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#667085"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    const fullDate = payload[0].payload?.fullDate
                    if (fullDate) {
                      return new Date(fullDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    }
                  }
                  return label
                }}
                formatter={(value) => [
                  `${value}${pollutantUnit ? ` ${pollutantUnit}` : ""}`,
                  pollutantLabel,
                ]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={getChartColor()}
                strokeWidth={2}
                dot={{ fill: getChartColor(), strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  stroke: getChartColor(),
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
