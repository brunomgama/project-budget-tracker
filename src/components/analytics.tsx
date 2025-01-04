"use client";

import TableOverview from "@/components/tableoverview";
import { Category, Expense, Project } from "@/types/interfaces/interface";
import { useState } from "react";
import { BarChartComponent } from "@/components/graphs/barchart";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import DatePickerSection from "@/components/datepickersection";

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
                <div className="mb-4 bg-white rounded-md">
                    <Select
                        onValueChange={(value) => setSelectedCategory(value === "all" ? null : parseInt(value))}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="All Categories"/>
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

                <BarChartComponent chartData={formattedChartData}/>
            </div>
        </div>
    );
}
