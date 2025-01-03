"use client";

import TabSelection from "@/components/tabSelection";
import { Component as BudgetRadialChart } from "@/components/budgetradialchart";
import { useEffect, useState } from "react";
import {
    APIProjectResponse,
    Project,
    Budget,
    Expense,
    APIBudgetResponse,
    APIExpenseResponse
} from "@/types/interfaces/interface";
import TableOverview from "@/components/tableoverview";
import InfoCard from "@/components/infocard";
import {Tabs, TabsContent} from "@/components/ui/tabs";
import Loading from "@/components/loading";

const headers = [
    { field: "name", label: "Name", type: "string" },
];

export default function HomePage() {
    const [data, setData] = useState<Project[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
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

    const totalBudget = budgets.reduce((sum, budget) => sum + budget.totalamount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const percentageConsumed = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

    const chartData = [
        { label: "Consumed", percentage: 100 - Math.round(percentageConsumed), value: totalExpenses, fill: "hsl(var(--chart-2))" },
    ];

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-left text-3xl font-bold" style={{ color: "var(--color-darker)" }}>
                Dashboard
            </h1>

            <TabSelection activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === "overview" && (
                <>
                    <div className="flex mt-6">
                        <div className="w-1/2 pr-4">
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

                        <div className="w-1/2 pl-4">
                            <BudgetRadialChart
                                chartData={chartData}
                                title="Budget Overview"
                                description={`Total Budget: ${totalBudget.toLocaleString()} €`}
                            />
                        </div>
                    </div>
                    </>
            )}
        </div>
    );
}
