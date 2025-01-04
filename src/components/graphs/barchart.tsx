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
            color: "hsl(243 75.4% 58.6%)",
        },
    };

    const allMonths = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const completeChartData = allMonths.map((month) => {
        const existingData = chartData.find((data) => data.month === month);
        return existingData || { month, amount: 0 };
    });

    return (
        <Card className="bg-transparent shadow-none border-none">
            <CardContent className="p-0">
                <ChartContainer config={chartConfig} className="bg-transparent">
                    <BarChart data={completeChartData} width={400} height={300} accessibilityLayer>
                        <CartesianGrid vertical={false} stroke="var(--gray-200)" />
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
