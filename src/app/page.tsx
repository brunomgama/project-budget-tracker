"use client";

import TabSelection from "@/components/tabSelection";
import InfoTable from "@/components/infotable";
import Pagination from "@/components/pagination";
import { useEffect, useState } from "react";
import { APIProjectResponse, Project, Budget } from "@/types/interfaces/interface";

const headers = [
    { field: "name", label: "Name", type: "string" },
];

export default function HomePage() {
    const [data, setData] = useState<Project[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]); // Budgets for the selected project
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

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
            } else {
                setBudgets([]);
            }
        } catch (error) {
            console.error("Error fetching budgets:", error);
            setBudgets([]);
        }
    };

    const handleSelectItem = (id: number) => {
        if (selectedItems.has(id)) {
            setSelectedItems(new Set());
            setBudgets([]);
        } else {
            setSelectedItems(new Set([id]));
            fetchBudgets(id);
        }
    };

    console.log(budgets)

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-left text-3xl font-bold" style={{ color: "var(--color-darker)" }}>
                Dashboard
            </h1>

            <TabSelection />

            <div className="flex">
                <div className="w-1/2 pr-4">
                    <InfoTable
                        data={paginatedData}
                        headers={headers}
                        selectedItems={selectedItems}
                        onSelectItem={handleSelectItem}
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onFirstPage={() => setCurrentPage(1)}
                        onPreviousPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        onNextPage={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        onLastPage={() => setCurrentPage(totalPages)}
                    />
                </div>

                <div className="w-1/2 pl-4">
                    {budgets.length > 0 ? (
                        <div>
                            <h2 className="text-xl font-bold">Budgets for Selected Project</h2>
                            <ul className="mt-4">
                                {budgets.map((budget) => (
                                    <li key={budget.id} className="border-b py-2">
                                        <strong>{budget.name}</strong>: {budget.totalamount} €
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-gray-500">Select a project to view its budget details.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
