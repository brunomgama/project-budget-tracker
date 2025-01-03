"use client";

import TableOverview from "@/components/tableoverview";
import { Category, Expense, Project } from "@/types/interfaces/interface";
import { useState } from "react";
import { BarChartComponent } from "@/components/graphs/barchart";

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
}) {
    const selectedProjectId = Array.from(selectedItems)[0] || null;
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    const filteredExpenses = expenses.filter((expense) => {
        const belongsToProject = selectedProjectId ? expense.budgetid === selectedProjectId : false;
        const matchesCategory = selectedCategory ? expense.categoryid === selectedCategory : true;
        const withinDateRange =
            (!startDate || new Date(expense.date) >= new Date(startDate)) &&
            (!endDate || new Date(expense.date) <= new Date(endDate));
        return belongsToProject && matchesCategory && withinDateRange;
    });

    const chartData = filteredExpenses.reduce<{ [month: string]: number }>((acc, expense) => {
        const date = new Date(expense.date);
        const month = date.toLocaleString("default", { month: "long" });
        acc[month] = (acc[month] || 0) + expense.amount;
        return acc;
    }, {});

    const formattedChartData = Object.entries(chartData).map(([month, amount]) => ({
        month,
        amount,
    }));

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
                <div className="mb-4">
                    <label htmlFor="category-select" className="block text-md font-medium text-gray-700">
                        Filter by Category
                    </label>
                    <select
                        id="category-select"
                        value={selectedCategory ?? ""}
                        onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-4 mb-4">
                    <div className="w-1/2">
                        <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="start-date"
                            value={startDate || ""}
                            onChange={(e) => setStartDate(e.target.value || null)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="end-date"
                            value={endDate || ""}
                            onChange={(e) => setEndDate(e.target.value || null)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <BarChartComponent chartData={formattedChartData} />
            </div>
        </div>
    );
}
