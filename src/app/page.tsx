"use client";

/**
 * Import necessary components and hooks.
 * - `TabSelection` for managing tab-based navigation.
 * - `Overview`, `Analytics`, and `Reports` components for displaying project-related data.
 * - `useState` and `useEffect` for managing state and side effects.
 */
import TabSelection from "@/components/tabSelection";
import {useCallback, useEffect, useState} from "react";
import {
    APIProjectResponse,
    Project,
    Budget,
    Expense,
    Category, APIBudgetResponse, APIExpenseResponse,
} from "@/types/interfaces/interface";
import Overview from "@/components/overview";
import Analytics from "@/components/analytics";
import Reports from "@/components/reports";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {TbCurrencyDollar, TbLayoutDashboard, TbReportMoney} from "react-icons/tb";
import CreateUpdateProject from "@/app/projects/createUpdateProject";
import CreateUpdateBudget from "@/app/budgets/createUpdateBudget";
import CreateUpdateExpense from "@/app/expenses/createUpdateExpense";
import Loading from "@/components/loading";
import Upload from "@/components/upload";
import {Switch} from "@/components/ui/switch";

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
    const [loading, setLoading] = useState(true);

    const [budgetAllData, setBudgetAllData] = useState<APIBudgetResponse | null>(null);
    const [expenseAllData, setExpenseAllData] = useState<APIExpenseResponse | null>(null);

    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const [showOnlyManager1, setShowOnlyManager1] = useState(true);
    const filteredData = showOnlyManager1 ? data.filter((project) => project.managerid === 1) : data;
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Dialog state to handle open/close for project, budget, and expense forms
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
    const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
    const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);

    /**
     * Fetch initial data (projects and categories) when the component mounts.
     */
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                await fetchData();
                await fetchCategories();
                await refreshData();
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const refreshData = () => {
        fetch("/api/budget")
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch budgets");
                return response.json();
            })
            .then((data) => setBudgetAllData(data))
            .catch((error) => console.error("Error fetching budgets:", error));

        fetch("/api/expense")
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch expenses");
                return response.json();
            })
            .then((data) => setExpenseAllData(data))
            .catch((error) => console.error("Error fetching expenses:", error));
    };


    /**
     * Fetch budgets for the selected project.
     */
    const fetchBudgets = useCallback(async (projectId: number) => {
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
    }, [selectedItems, fetchBudgets]);

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
        setLoading(true);
        await fetchData();
        await fetchCategories();
        await refreshData();
        setLoading(false);
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
            {loading ? (
                <Loading />
            ) : (
                <>
                    <TabSelection
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        projectData={data}
                        budgetData={budgetAllData?.budgets || []}
                        expenseData={expenseAllData?.expenses || []}
                    />

                    {activeTab === "overview" && (
                        <div className="flex gap-2 mt-4">
                            <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                                        <TbLayoutDashboard/> Add Project
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <CreateUpdateProject
                                        selectedItems={new Set()}
                                        handleCreateOrUpdate={setIsProjectDialogOpen}
                                        refreshData={refreshOverviewData}
                                    />
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                                        <TbCurrencyDollar/> Add Budget
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <CreateUpdateBudget
                                        selectedItems={new Set()}
                                        handleCreateOrUpdate={setIsBudgetDialogOpen}
                                        refreshData={refreshOverviewData}
                                    />
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                                        <TbReportMoney/> Add Expense
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <CreateUpdateExpense
                                        selectedItems={new Set()}
                                        handleCreateOrUpdate={setIsExpenseDialogOpen}
                                        refreshData={refreshOverviewData}
                                    />
                                </DialogContent>
                            </Dialog>

                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={showOnlyManager1}
                                    onCheckedChange={(checked) => setShowOnlyManager1(checked)}
                                    className="data-[state=checked]:bg-indigo-500" />
                                <span>{showOnlyManager1 ? "Showing manager projects" : "Showing all projects"}</span>
                            </div>
                        </div>
                    )}

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
                    {activeTab === "upload" && (
                        <Upload />
                    )}
                </>
            )}
        </div>
    );
}
