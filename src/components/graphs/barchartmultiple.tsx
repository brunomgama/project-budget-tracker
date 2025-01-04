"use client";

import { Bar, BarChart, CartesianGrid, XAxis, Legend, LabelList } from "recharts";

import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

interface BarChartMultipleComponentProps {
    chartData: { month: string; budget: number; expenses: number }[];
    chartConfig: ChartConfig;
}

export function BarChartMultipleComponent({ chartData, chartConfig }: BarChartMultipleComponentProps) {
    return (
        <Card className="bg-transparent shadow-none border-none">
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData} barCategoryGap={20}>
                        <CartesianGrid vertical={true} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Bar dataKey="budget" fill="hsl(var(--chart-2))" radius={4}>
                            <LabelList dataKey="budget" position="top" />
                        </Bar>
                        <Bar dataKey="expenses" fill="hsl(var(--chart-1))" radius={4}>
                            <LabelList dataKey="expenses" position="top" />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
