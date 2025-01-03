"use client";

import TabSelection from "@/components/tabSelection";
import { useEffect, useState } from "react";
import {
    APIProjectResponse,
    Project,
    Budget,
    Expense, Category,
} from "@/types/interfaces/interface";
import Overview from "@/components/overview";
import Analytics from "@/components/analytics";

const headers = [
    { field: "name", label: "Name", type: "string" },
];

export default function HomePage() {
    const [data, setData] = useState<Project[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [activeTab, setActiveTab] = useState("overview");

    const itemsPerPage = 10;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch("/api/project")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then((data: APIProjectResponse) => {
                setData(data.projects);
                setSelectedItems(new Set());
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const fetchBudgets = async (projectId: number) => {
        try {
            const response = await fetch(`/api/budget/project/${projectId}`);
            const result = await response.json();
            if (response.ok) {
                setBudgets(result.budgets);
                const budgetIds = result.budgets.map((b: Budget) => b.id);
                if (budgetIds.length > 0) {
                    fetchExpenses(budgetIds);
                } else {
                    setExpenses([]);
                }
            } else {
                setBudgets([]);
                setExpenses([]);
            }
        } catch (error) {
            console.error("Error fetching budgets:", error);
            setBudgets([]);
            setExpenses([]);
        }
    };

    const fetchExpenses = async (budgetIds: number[]) => {
        try {
            const response = await fetch(`/api/expense/budgets?ids=${budgetIds.join(",")}`);
            const result = await response.json();
            if (response.ok) {
                setExpenses(result.expenses);
            } else {
                setExpenses([]);
            }
        } catch (error) {
            console.error("Error fetching expenses:", error);
            setExpenses([]);
        }
    };

    const handleSelectItem = (id: number) => {
        if (selectedItems.has(id)) {
            setSelectedItems(new Set());
            setBudgets([]);
            setExpenses([]);
        } else {
            setSelectedItems(new Set([id]));
            fetchBudgets(id);
        }
    };

    useEffect(() => {
        fetch("/api/category")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch categories");
                }
                return response.json();
            })
            .then((data) => setCategories(data.categories))
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    }, []);

    const totalBudget = budgets.reduce((sum, budget) => sum + budget.totalamount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const percentageConsumed = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

    const colorGraphFill = percentageConsumed < 25 ? "hsl(var(--chart-2))" : (percentageConsumed < 50 ? "hsl(var(--chart-4))" : "hsl(var(--chart-1))");

    const chartData = [
        { label: "Consumed", percentage: 100 - Math.round(percentageConsumed), value: totalExpenses, fill: colorGraphFill },
    ];

    return (
        <div className="container mx-auto px-4">

            <TabSelection activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === "overview" && (
                <Overview
                    paginatedData={paginatedData}
                    headers={headers}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    selectedItems={selectedItems}
                    handleSelectItem={handleSelectItem}
                    setCurrentPage={setCurrentPage}
                    chartData={chartData}
                    totalBudget={totalBudget}
                />

            )}
            {activeTab === "analytics" && (
                <Analytics
                    paginatedData={paginatedData}
                    headers={headers}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    selectedItems={selectedItems}
                    handleSelectItem={handleSelectItem}
                    setCurrentPage={setCurrentPage}
                    expenses={expenses}
                    categories={categories}
                />
            )}

        </div>
    );
}
