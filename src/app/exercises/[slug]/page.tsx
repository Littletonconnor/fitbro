'use client'

import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/chart'

interface PageProps {
  params: { slug: string }
}
const chartData = [
  { date: '2024-04-01', setOne: '222', setTwo: '150' },
  { date: '2024-04-02', setOne: '97', setTwo: '180' },
  { date: '2024-04-03', setOne: '167', setTwo: '120' },
  { date: '2024-04-04', setOne: '100', setTwo: '260' },
  { date: '2024-04-05', setOne: '373', setTwo: '290' },
  { date: '2024-04-06', setOne: '301', setTwo: '340' },
  { date: '2024-04-07', setOne: '245', setTwo: '180' },
  { date: '2024-04-08', setOne: '409', setTwo: '320' },
  { date: '2024-04-09', setOne: '59', setTwo: '110' },
  { date: '2024-04-10', setOne: '261', setTwo: '190' },
  { date: '2024-04-11', setOne: '327', setTwo: '350' },
  { date: '2024-04-12', setOne: '292', setTwo: '210' },
  { date: '2024-04-13', setOne: '342', setTwo: '380' },
]

const chartConfig = {
  weight: {
    label: 'Weight',
  },
  setOne: {
    label: 'setOne',
    color: 'hsl(var(--chart-1))',
  },
  setTwo: {
    label: 'setTwo',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export default function Page({ params }: PageProps) {
  return (
    <div className="flex flex-col w-full max-w-5xl">
      <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
        Squat
      </h1>
      <p className="text-lg font-light text-foreground mt-2 mb-4 lg:mb-12">
        Squat progression over time
      </p>
      <div className="space-y-12">
        <WeightChart />
        <OneRepMaxChart />
        <SetChart />
      </div>
    </div>
  )
}
function WeightChart() {
  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-md font-semibold">Weight</h3>
      <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <YAxis
            hide
            domain={[0, 'dataMax + 350']}
            tickLine={false}
            axisLine={false}
            allowDataOverflow={true}
          />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value)
              return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[150px]"
                nameKey="views"
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                }}
              />
            }
          />
          <Area
            dataKey="setOne"
            type="natural"
            fill="var(--color-setOne)"
            fillOpacity={0.4}
            stroke="var(--color-setOne)"
          />
          <Area
            dataKey="setTwo"
            type="natural"
            fill="var(--color-setTwo)"
            fillOpacity={0.4}
            stroke="var(--color-setTwo)"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

function OneRepMaxChart() {
  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-md font-semibold">One Rep Max</h3>
      <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 12,
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <YAxis
            hide
            domain={[0, 'dataMax + 350']}
            tickLine={false}
            axisLine={false}
            allowDataOverflow={true}
          />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value)
              return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[150px]"
                nameKey="views"
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                }}
              />
            }
          />
          <Bar dataKey="setOne" fill="var(--color-setOne)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

function SetChart() {
  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-md font-semibold">Set Volume</h3>
      <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 12,
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <YAxis
            hide
            domain={[0, 'dataMax + 50']}
            tickLine={false}
            axisLine={false}
            allowDataOverflow={true}
          />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value)
              return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[150px]"
                nameKey="views"
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                }}
              />
            }
          />
          <Bar dataKey="setOne" fill="var(--color-setOne)" radius={4} />
          <Bar dataKey="setTwo" fill="var(--color-setTwo)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
