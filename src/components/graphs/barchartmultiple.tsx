"use client";

/**
 * Import necessary components and libraries.
 * - `BarChart`, `Bar`, `CartesianGrid`, `XAxis`, `Legend`, `LabelList` from `recharts` for rendering the bar chart.
 * - `Card` and `CardContent` for structured container layout.
 * - `ChartConfig`, `ChartContainer`, `ChartTooltip`, and `ChartTooltipContent` for enhanced chart styling and tooltips.
 */
import { Bar, BarChart, CartesianGrid, XAxis, Legend, LabelList } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

/**
 * Define the props for the `BarChartMultipleComponent`.
 * - `chartData`: Array of objects containing `month`, `budget`, and `expenses` values.
 * - `chartConfig`: Configuration object for chart styling, such as color and label.
 */
interface BarChartMultipleComponentProps {
    chartData: { month: string; budget: number; expenses: number }[];
    chartConfig: ChartConfig;
}

/**
 * Functional component for displaying a comparison bar chart for budgets and expenses by month.
 */
export function BarChartMultipleComponent({ chartData, chartConfig }: BarChartMultipleComponentProps) {
    return (
        <Card className="bg-transparent shadow-none border-none">
            <CardContent>
                {/* Container for the bar chart with applied styling from the configuration */}
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData} barCategoryGap={20}>
                        {/* Grid lines for better readability */}
                        <CartesianGrid vertical={true} />

                        {/* X-axis displaying abbreviated month names */}
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)} // Show first 3 letters of month
                        />

                        {/* Tooltip to display data on hover */}
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />

                        {/* Legend to differentiate between budget and expense bars */}
                        <Legend verticalAlign="top" height={36} />

                        {/* Bar representing budget data */}
                        <Bar dataKey="budget" fill="hsl(var(--chart-2))" radius={4}>
                            {/* Display budget value above each bar */}
                            <LabelList dataKey="budget" position="top" />
                        </Bar>

                        {/* Bar representing expense data */}
                        <Bar dataKey="expenses" fill="hsl(var(--chart-1))" radius={4}>
                            {/* Display expense value above each bar */}
                            <LabelList dataKey="expenses" position="top" />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
