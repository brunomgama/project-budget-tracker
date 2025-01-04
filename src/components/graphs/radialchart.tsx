"use client";

import { TrendingUp } from "lucide-react";
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";

type ChartData = {
    label: string;
    percentage: number;
    value: number;
    fill: string;
};

const chartConfig = {
    visitors: {
        label: "Budget",
    },
    safari: {
        label: "Default Color",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

interface ComponentProps {
    chartData: ChartData[];
    title?: string;
    description?: string;
}

export function RadialChartComponent({ chartData, title = "Budget Overview", description = "Project Budget Allocation" }: ComponentProps) {
    return (
        <div className="flex flex-col items-center">
            <div className="text-center">
                <h2 className="text-lg font-bold">{title}</h2>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
            <div className="flex justify-center">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-80 min-h-80"
                >
                    <RadialBarChart
                        data={chartData}
                        startAngle={90}
                        endAngle={90 + (360 * chartData[0].percentage) / 100}
                        innerRadius={70}
                        outerRadius={100}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                        />
                        <RadialBar
                            dataKey="percentage"
                            cornerRadius={10}
                            fill={chartData[0].fill}
                        />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-lg font-bold"
                                                >
                                                    {chartData[0]?.value?.toLocaleString() || 0} €
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    {chartData[0]?.label || "No Data"}
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer>
            </div>
            <div className="text-center mt-2">
                <p className="text-sm font-medium">
                    You have available {chartData[0].percentage}% of your budget
                </p>
            </div>
        </div>
    );
}
