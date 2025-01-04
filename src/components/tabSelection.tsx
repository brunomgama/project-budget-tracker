"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InfoCard from "@/components/infocard";
import { TbCurrencyDollar, TbLayoutDashboard, TbTags } from "react-icons/tb";
import {Budget, Expense, Project} from "@/types/interfaces/interface";

export default function TabSelection({
                                         activeTab,
                                         setActiveTab,
                                         projectData,
                                         budgetData,
                                         expenseData,
                                     }: {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    projectData: Project[];
    budgetData: Budget[];
    expenseData: Expense[];
}) {
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
                </div>

                {activeTab === "overview" && (
                    <TabsContent value="overview">
                        <div className="flex flex-wrap gap-4 mt-6">
                            <InfoCard
                                title="Total Projects"
                                value={projectData.length.toString()}
                                icon={<TbLayoutDashboard />}
                                href="/projects"
                            />
                            <InfoCard
                                title="Total Budgets"
                                value={budgetData.length.toString()}
                                icon={<TbCurrencyDollar />}
                                href="/budgets"
                            />
                            <InfoCard
                                title="Total Expenses"
                                value={expenseData.length.toString()}
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
