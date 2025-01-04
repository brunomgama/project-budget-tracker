"use client";

/**
 * Import necessary components and types:
 * - `TableOverview`: Displays a table with paginated data.
 * - `Select`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectTrigger`, `SelectValue`: Custom dropdown components.
 * - `DatePickerSection`: Date picker component for filtering expenses by date range.
 * - `BarChartMultipleComponent`: Displays a bar chart showing the budget vs. expenses for each month.
 */
import TableOverview from "@/components/tableoverview";
import { Category, Expense, Project, Budget } from "@/types/interfaces/interface";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import DatePickerSection from "@/components/datepickersection";
import { BarChartMultipleComponent } from "@/components/graphs/barchartmultiple";

/**
 * Main `Analytics` component:
 * Displays an overview table and a bar chart comparing budget and expenses.
 * Props:
 * - `paginatedData`: List of projects to display in the overview table.
 * - `headers`: Headers for the overview table.
 * - `currentPage`: Current page for pagination.
 * - `totalPages`: Total number of pages for pagination.
 * - `selectedItems`: Set of selected project IDs.
 * - `handleSelectItem`: Function to handle selection of a project.
 * - `setCurrentPage`: Function to set the current page.
 * - `expenses`: List of expenses to display.
 * - `categories`: List of categories for filtering.
 * - `budgets`: List of budgets for the selected project.
 */
export default function Analytics({
                                      paginatedData,
                                      headers,
                                      currentPage,
                                      totalPages,
                                      selectedItems,
                                      handleSelectItem,
                                      setCurrentPage,
                                      expenses,
                                      categories,
                                      budgets = [],
                                  }: {
    paginatedData: Project[];
    headers: { field: string; label: string; type: string }[];
    currentPage: number;
    totalPages: number;
    selectedItems: Set<number>;
    handleSelectItem: (id: number) => void;
    setCurrentPage: (page: number) => void;
    expenses: Expense[];
    categories: Category[];
    budgets: Budget[];
}) {
    /**
     * State variables:
     * - `selectedProjectId`: ID of the selected project.
     * - `selectedCategory`: ID of the selected category for filtering.
     * - `startDate` and `endDate`: Date range for filtering expenses.
     */
    const selectedProjectId = Array.from(selectedItems)[0] || null;
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    /**
     * Filter budgets based on the selected project and category.
     */
    const projectBudgets = budgets.filter((budget) => {
        const belongsToProject = budget.projectid === selectedProjectId;
        const matchesCategory = selectedCategory ? budget.categoryid === selectedCategory : true;
        return belongsToProject && matchesCategory;
    });

    /**
     * Calculate the total budget for the selected project.
     */
    const totalBudget = projectBudgets.reduce((sum, budget) => sum + budget.totalamount, 0);

    /**
     * Filter expenses based on the selected project, category, and date range.
     */
    const filteredExpenses = expenses.filter((expense) => {
        const belongsToProject = projectBudgets.some((budget) => budget.id === expense.budgetid);
        const matchesCategory = selectedCategory ? expense.categoryid === selectedCategory : true;
        const withinDateRange =
            (!startDate || new Date(expense.date) >= new Date(startDate)) &&
            (!endDate || new Date(expense.date) <= new Date(endDate));
        return belongsToProject && matchesCategory && withinDateRange;
    });

    /**
     * List of months for the chart.
     */
    const allMonths = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    /**
     * Generate data for the bar chart:
     * - `budget`: Remaining budget after expenses for each month.
     * - `expenses`: Total expenses for each month.
     */
    let cumulativeExpenses = 0;
    const chartData = allMonths.map((month, index) => {
        const monthlyExpenses = filteredExpenses
            .filter((expense) => new Date(expense.date).getMonth() === index)
            .reduce((sum, expense) => sum + expense.amount, 0);

        cumulativeExpenses += monthlyExpenses;
        const availableBudget = totalBudget - cumulativeExpenses;

        return {
            month,
            budget: availableBudget < 0 ? 0 : availableBudget,
            expenses: monthlyExpenses,
        };
    });

    /**
     * Configuration for the chart:
     * - `budget`: Label and color for the available budget.
     * - `expenses`: Label and color for the expenses.
     */
    const chartConfig = {
        budget: {
            label: "Available Budget",
            color: "hsl(var(--chart-1))",
        },
        expenses: {
            label: "Expenses",
            color: "hsl(var(--chart-2))",
        },
    };

    return (
        <div className="flex mt-6">
            {/* Left section: Overview table displaying paginated project data */}
            <div className="w-1/3 pr-4">
                <TableOverview
                    data={paginatedData}
                    headers={headers}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    selectedItems={selectedItems}
                    handleSelectItem={handleSelectItem}
                    setCurrentPage={setCurrentPage}
                />
            </div>

            {/* Right section: Filters and bar chart */}
            <div className="w-2/3 pr-4">
                {/* Category filter dropdown */}
                <div className="mb-4 bg-white rounded-md">
                    <Select
                        onValueChange={(value) => setSelectedCategory(value === "all" ? null : parseInt(value))}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Date range picker for filtering expenses by date */}
                <DatePickerSection
                    startDate={startDate ? new Date(startDate) : undefined}
                    endDate={endDate ? new Date(endDate) : undefined}
                    setStartDate={(date) => setStartDate(date ? date.toISOString().split("T")[0] : null)}
                    setEndDate={(date) => setEndDate(date ? date.toISOString().split("T")[0] : null)}
                />

                {/* Bar chart displaying budget vs expenses */}
                <BarChartMultipleComponent chartData={chartData} chartConfig={chartConfig} />
            </div>
        </div>
    );
}
