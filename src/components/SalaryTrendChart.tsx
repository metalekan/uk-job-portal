"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A simple area chart"

const chartConfig = {
  salary: {
    label: "Salary",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface SalaryTrendChartProps {
    data: { date: string; salary: number }[];
    categoryLabel: string;
}

export function SalaryTrendChart({ data, categoryLabel }: SalaryTrendChartProps) {
  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>Average Salary Trend</CardTitle>
        <CardDescription>
          Monthly average salary for &quot;{categoryLabel}&quot; in London
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="salary"
              type="natural"
              fill="var(--color-salary)"
              fillOpacity={0.4}
              stroke="var(--color-salary)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
