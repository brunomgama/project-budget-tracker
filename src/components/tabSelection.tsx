"use client";

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import InfoCard from "@/components/infocard";
import Loading from "@/components/loading";
import {useEffect, useState} from "react";
import {APIBudgetResponse, APIExpenseResponse, APIProjectResponse} from "@/types/interfaces/interface";

export default function TabSelection({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {

    const [projectData, setProjectData] = useState<APIProjectResponse | null>(null);
    const [budgetData, setBudgetData] = useState<APIBudgetResponse | null>(null);
    const [expenseData, setExpenseData] = useState<APIExpenseResponse | null>(null);


    useEffect(() => {
        fetch("/api/project")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then((data) => setProjectData(data))
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    useEffect(() => {
        fetch("/api/budget")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then((data) => setBudgetData(data))
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    useEffect(() => {
        fetch("/api/expense")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then((data) => setExpenseData(data))
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    if (!projectData || !budgetData || !expenseData) {
        return <Loading />;
    }

    return (
        <div className={"mt-6"}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-indigo-100 rounded-lg">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Overview</TabsTrigger>
                    <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Analytics</TabsTrigger>
                    <TabsTrigger value="reports" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Reports</TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Notifications</TabsTrigger>
                </TabsList>

                { activeTab === "overview" && (
                    <TabsContent value="overview">
                        <div className="flex flex-wrap gap-4 mt-6">
                            <InfoCard title="Total Projects" value={projectData.projects.length.toString()} />
                            <InfoCard title="Total Budgets" value={budgetData.budgets.length.toString()} />
                            <InfoCard title="Total Expenses" value={expenseData.expenses.length.toString()} />
                        </div>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}
