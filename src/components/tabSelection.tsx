"use client"

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useEffect, useState} from "react";
import {APIBudgetResponse, APIExpenseResponse, APIProjectResponse} from "@/types/interfaces/interface";
import Loading from "@/components/loading";
import InfoCard from "@/components/infocard";

export default function TabSelection() {
    const [projectData, setProjectData] = useState<APIProjectResponse | null>(null);
    const [budgetData, setBudgetData] = useState<APIBudgetResponse | null>(null);
    const [expenseData, setExpenseData] = useState<APIExpenseResponse | null>(null);

    const [error, setError] = useState<string | null>(null);

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
                setError(error.message);
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
                setError(error.message);
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
                setError(error.message);
            });
    }, []);

    if (error) {
        return (<p className="text-center text-sm font-medium" style={{ color: "var(--color-error)" }}>Error: {error}</p>);
    }

    if (!projectData || !budgetData || !expenseData) {
        return <Loading />;
    }

    return (
        <div className={"mt-6"}>
            <Tabs defaultValue="overview">
                <TabsList style={{backgroundColor: "var(--color-lighter)"}}>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <div className="flex flex-wrap gap-4 mt-6">
                        <InfoCard title="Total Projects" value={projectData.projects.length.toString()} />
                        <InfoCard title="Total Budgets" value={budgetData.budgets.length.toString()} />
                        <InfoCard title="Total Expenses" value={expenseData.expenses.length.toString()} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}