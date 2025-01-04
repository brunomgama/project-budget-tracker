"use client";

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
    const selectedProjectId = Array.from(selectedItems)[0] || null;
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    // Filter budgets based on the project and the selected category
    const projectBudgets = budgets.filter((budget) => {
        const belongsToProject = budget.projectid === selectedProjectId;
        const matchesCategory = selectedCategory ? budget.categoryid === selectedCategory : true; // Add category filter
        return belongsToProject && matchesCategory;
    });

    const totalBudget = projectBudgets.reduce((sum, budget) => sum + budget.totalamount, 0);

    const filteredExpenses = expenses.filter((expense) => {
        const belongsToProject = projectBudgets.some((budget) => budget.id === expense.budgetid);
        const matchesCategory = selectedCategory ? expense.categoryid === selectedCategory : true;
        const withinDateRange =
            (!startDate || new Date(expense.date) >= new Date(startDate)) &&
            (!endDate || new Date(expense.date) <= new Date(endDate));
        return belongsToProject && matchesCategory && withinDateRange;
    });

    const allMonths = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

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

            <div className="w-2/3 pr-4">
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

                <DatePickerSection
                    startDate={startDate ? new Date(startDate) : undefined}
                    endDate={endDate ? new Date(endDate) : undefined}
                    setStartDate={(date) => setStartDate(date ? date.toISOString().split("T")[0] : null)}
                    setEndDate={(date) => setEndDate(date ? date.toISOString().split("T")[0] : null)}
                />

                <BarChartMultipleComponent chartData={chartData} chartConfig={chartConfig} />
            </div>
        </div>
    );
}
