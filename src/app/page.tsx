"use client";

/**
 * Import necessary components and hooks.
 * - `TabSelection` for managing tab-based navigation.
 * - `Overview`, `Analytics`, and `Reports` components for displaying project-related data.
 * - `useState` and `useEffect` for managing state and side effects.
 */
import TabSelection from "@/components/tabSelection";
import { useEffect, useState } from "react";
import {
    APIProjectResponse,
    Project,
    Budget,
    Expense,
    Category,
} from "@/types/interfaces/interface";
import Overview from "@/components/overview";
import Analytics from "@/components/analytics";
import Reports from "@/components/reports";

/**
 * Define headers for project data table.
 * - Specifies the field name, label, and data type for display in the `Overview`, `Analytics`, and `Reports`.
 */
const headers = [
    { field: "name", label: "Project", type: "string" },
    { field: "budgetTotal", label: "Budget Total (€)", type: "money" },
    { field: "expenseTotal", label: "Expense Total (€)", type: "money" },
];

/**
 * Main component for the HomePage, displaying project data in tabs (Overview, Analytics, Reports).
 * - Handles data fetching for projects, budgets, expenses, and categories.
 */
export default function HomePage() {
    // State variables for storing and managing project-related data.
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

    /**
     * Fetch initial data (projects and categories) when the component mounts.
     */
    useEffect(() => {
        fetchData();
        fetchCategories();
    }, []);

    /**
     * Fetch budgets and expenses when a project is selected.
     */
    useEffect(() => {
        if (selectedItems.size > 0) {
            const projectId = Array.from(selectedItems)[0];
            fetchBudgets(projectId);
        } else {
            setBudgets([]);
            setExpenses([]);
        }
    }, [selectedItems]);

    /**
     * Fetch project data from the API.
     * - Includes calculation of total budgets and expenses for each project.
     */
    const fetchData = () => {
        fetch("/api/project")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then(async (data: APIProjectResponse) => {
                const projects = data.projects;

                // Fetch budgets and expenses for each project and calculate totals.
                const projectsWithTotals = await Promise.all(
                    projects.map(async (project) => {
                        const budgetResponse = await fetch(`/api/budget/project/${project.id}`);
                        const budgetData = await budgetResponse.json();
                        const budgets: Budget[] = budgetData.budgets || [];

                        const budgetTotal = budgets.reduce((sum: number, b: Budget) => sum + b.totalamount, 0);
                        const budgetIds = budgets.map((b: Budget) => b.id);
                        let expenseTotal = 0;

                        if (budgetIds.length > 0) {
                            const expenseResponse = await fetch(`/api/expense/budgets?ids=${budgetIds.join(",")}`);
                            const expenseData = await expenseResponse.json();
                            expenseTotal = expenseData.expenses.reduce((sum: number, e: Expense) => sum + e.amount, 0);
                        }

                        return {
                            ...project,
                            budgetTotal,
                            expenseTotal,
                        };
                    })
                );

                setData(projectsWithTotals);
                setSelectedItems(new Set());
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    /**
     * Fetch budgets for the selected project.
     */
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

    /**
     * Fetch expenses for the provided budget IDs.
     */
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

    /**
     * Fetch categories from the API.
     */
    const fetchCategories = async () => {
        try {
            const response = await fetch("/api/category");
            const data = await response.json();
            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }
            setCategories(data.categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    /**
     * Refresh data when the "Refresh" button is clicked.
     */
    const refreshOverviewData = async () => {
        console.log("Refreshing Overview Data...");
        await fetchData();
        await fetchCategories();
    };

    /**
     * Handle selection of a project item.
     * - Allows only one project to be selected at a time.
     */
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

    /**
     * Calculate total budget, total expenses, and the percentage consumed for the selected project.
     */
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.totalamount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const percentageConsumed = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

    /**
     * Determine chart fill color based on percentage consumed.
     */
    const colorGraphFill = percentageConsumed < 25 ? "hsl(var(--chart-2))" : (percentageConsumed < 50 ? "hsl(var(--chart-4))" : "hsl(var(--chart-1))");

    /**
     * Chart data for displaying budget consumption.
     */
    const chartData = [
        { label: "Consumed", percentage: 100 - Math.round(percentageConsumed), value: totalExpenses, fill: colorGraphFill },
    ];

    /**
     * Render the home page with tabs for "Overview", "Analytics", and "Reports".
     */
    return (
        <div className="container mx-auto">
            <TabSelection
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                refreshOverviewData={refreshOverviewData}
            />
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
                    budgets={budgets}
                />
            )}
            {activeTab === "reports" && (
                <Reports
                    paginatedData={paginatedData}
                    headers={headers}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    selectedItems={selectedItems}
                    handleSelectItem={handleSelectItem}
                    setCurrentPage={setCurrentPage}
                    expenses={expenses}
                    categories={categories}
                    budgets={budgets}
                />
            )}
        </div>
    );
}
