"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface BarChartProps {
    chartData: { month: string; amount: number }[];
}

export function BarChartComponent({ chartData }: BarChartProps) {
    const chartConfig: ChartConfig = {
        desktop: {
            label: "Expenses",
            color: "hsl(var(--chart-1))",
        },
    };

    return (
        <Card>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart data={chartData} width={400} height={300} accessibilityLayer>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey="amount" fill="var(--color-desktop)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
