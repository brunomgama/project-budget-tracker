"use client";

import { TrendingUp } from "lucide-react";
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-80 min-h-80"
                >
                    <RadialBarChart
                        data={chartData}
                        startAngle={90}
                        endAngle={90 + (360 * chartData[0].percentage) / 100}
                        innerRadius={80}
                        outerRadius={110}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            polarRadius={[86, 74]}
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
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    <p>
                        {`You have available ${chartData[0].percentage}% of your budget`}
                    </p>
                    <TrendingUp className="h-4 w-4" />
                </div>
            </CardFooter>
        </Card>
    );
}
