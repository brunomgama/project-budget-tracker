"use client";

/**
 * Import necessary components and libraries:
 * - `TrendingUp`: Icon for optional visual enhancements.
 * - `Label`, `PolarGrid`, `PolarRadiusAxis`, `RadialBar`, `RadialBarChart` from `recharts` for creating radial charts.
 * - `ChartConfig`, `ChartContainer`: Custom chart UI components for styling and structure.
 */
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

/**
 * Define the structure of the chart data.
 * - `label`: Label for the data point (e.g., "Consumed").
 * - `percentage`: Percentage value to display on the chart.
 * - `value`: Actual numerical value corresponding to the percentage.
 * - `fill`: The color of the radial bar.
 */
type ChartData = {
    label: string;
    percentage: number;
    value: number;
    fill: string;
};

/**
 * Configuration for different chart states and default styles.
 * - `visitors`: Represents the default label for the radial chart.
 * - `safari`: Custom color for the radial bar.
 */
const chartConfig = {
    visitors: {
        label: "Budget",
    },
    safari: {
        label: "Default Color",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

/**
 * Component props:
 * - `chartData`: Array of objects representing the chart data points.
 * - `title`: Optional title for the chart (defaults to "Budget Overview").
 * - `description`: Optional description below the title (defaults to "Project Budget Allocation").
 */
interface ComponentProps {
    chartData: ChartData[];
    title?: string;
    description?: string;
}

/**
 * Functional component for displaying a radial chart.
 */
export function RadialChartComponent({
                                         chartData,
                                         title = "Budget Overview",
                                         description = "Project Budget Allocation",
                                     }: ComponentProps) {
    return (
        <div className="flex flex-col items-center">
            {/* Section displaying the chart title and description */}
            <div className="text-center">
                <h2 className="text-lg font-bold">{title}</h2>
                <p className="text-sm text-gray-600">{description}</p>
            </div>

            {/* Container for the radial bar chart */}
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
                        {/* Circular grid lines for visual structure */}
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                        />

                        {/* Radial bar representing the budget percentage */}
                        <RadialBar
                            dataKey="percentage"
                            cornerRadius={10}
                            fill={chartData[0].fill}
                        />

                        {/* Center label displaying the value and label inside the radial chart */}
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
                                                {/* Display the actual numerical value */}
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-lg font-bold"
                                                >
                                                    {chartData[0]?.value?.toLocaleString() || 0} €
                                                </tspan>
                                                {/* Display the label (e.g., "Consumed" or "Remaining") */}
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

            {/* Text below the chart showing the remaining percentage of the budget */}
            <div className="text-center mt-2">
                <p className="text-sm font-medium">
                    You have available {chartData[0].percentage}% of your budget
                </p>
            </div>
        </div>
    );
}
