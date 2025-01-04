/**
 * TabSelection Component
 *
 * Displays a tab interface with three main sections: Overview, Analytics, and Reports.
 * Each section contains actions and info cards relevant to the selected tab.
 *
 * Props:
 * - `activeTab`: Currently selected tab.
 * - `setActiveTab`: Function to update the selected tab.
 * - `refreshOverviewData`: Function to refresh data when changes occur.
 */

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InfoCard from "@/components/infocard";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";
import { APIBudgetResponse, APIExpenseResponse, APIProjectResponse } from "@/types/interfaces/interface";
import { TbCurrencyDollar, TbLayoutDashboard, TbReportMoney, TbTags } from "react-icons/tb";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreateUpdateBudget from "@/app/budgets/createUpdateBudget";
import { Button } from "@/components/ui/button";
import CreateUpdateExpense from "@/app/expenses/createUpdateExpense";
import CreateUpdateProject from "@/app/projects/createUpdateProject";

export default function TabSelection({
                                         activeTab,
                                         setActiveTab,
                                         refreshOverviewData,
                                     }: {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    refreshOverviewData: () => void;
}) {
    // State for fetched project, budget, and expense data
    const [projectData, setProjectData] = useState<APIProjectResponse | null>(null);
    const [budgetData, setBudgetData] = useState<APIBudgetResponse | null>(null);
    const [expenseData, setExpenseData] = useState<APIExpenseResponse | null>(null);

    // Dialog state to handle open/close for project, budget, and expense forms
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
    const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
    const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = () => {
        fetch("/api/project")
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch projects");
                return response.json();
            })
            .then((data) => setProjectData(data))
            .catch((error) => console.error("Error fetching projects:", error));

        fetch("/api/budget")
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch budgets");
                return response.json();
            })
            .then((data) => setBudgetData(data))
            .catch((error) => console.error("Error fetching budgets:", error));

        fetch("/api/expense")
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch expenses");
                return response.json();
            })
            .then((data) => setExpenseData(data))
            .catch((error) => console.error("Error fetching expenses:", error));

        refreshOverviewData();
    };

    if (!projectData || !budgetData || !expenseData) {
        return <Loading />;
    }

    return (
        <div className="mt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex justify-between items-center">
                    <TabsList className="bg-indigo-100 rounded-lg">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger value="reports" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                            Reports
                        </TabsTrigger>
                    </TabsList>

                    {activeTab === "overview" && (
                        <div className="flex gap-2">
                            <Dialog
                                open={isProjectDialogOpen}
                                onOpenChange={(open) => {
                                    setIsProjectDialogOpen(open);
                                    if (!open) refreshOverviewData();
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                                        <TbLayoutDashboard />
                                        Add Project
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <CreateUpdateProject
                                        selectedItems={new Set()}
                                        handleCreateOrUpdate={setIsProjectDialogOpen}
                                        refreshData={refreshData}
                                    />
                                </DialogContent>
                            </Dialog>

                            <Dialog
                                open={isBudgetDialogOpen}
                                onOpenChange={(open) => {
                                    setIsBudgetDialogOpen(open);
                                    if (!open) refreshOverviewData();
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                                        <TbCurrencyDollar />
                                        Add Budget
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <CreateUpdateBudget
                                        selectedItems={new Set()}
                                        handleCreateOrUpdate={setIsBudgetDialogOpen}
                                        refreshData={refreshData}
                                    />
                                </DialogContent>
                            </Dialog>

                            <Dialog
                                open={isExpenseDialogOpen}
                                onOpenChange={(open) => {
                                    setIsExpenseDialogOpen(open);
                                    if (!open) refreshOverviewData();
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                                        <TbReportMoney />
                                        Add Expense
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <CreateUpdateExpense
                                        selectedItems={new Set()}
                                        handleCreateOrUpdate={setIsExpenseDialogOpen}
                                        refreshData={refreshData}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                </div>

                {activeTab === "overview" && (
                    <TabsContent value="overview">
                        <div className="flex flex-wrap gap-4 mt-6">
                            <InfoCard
                                title="Total Projects"
                                value={projectData?.projects.length.toString()}
                                icon={<TbLayoutDashboard />}
                                href="/projects"
                            />
                            <InfoCard
                                title="Total Budgets"
                                value={budgetData?.budgets.length.toString()}
                                icon={<TbCurrencyDollar />}
                                href="/budgets"
                            />
                            <InfoCard
                                title="Total Expenses"
                                value={expenseData?.expenses.length.toString()}
                                icon={<TbTags />}
                                href="/expenses"
                            />
                        </div>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}
