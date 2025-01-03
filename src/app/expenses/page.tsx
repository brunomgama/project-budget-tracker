"use client";

import { useEffect, useState } from "react";
import {APIExpenseResponse, Expense} from "@/types/interfaces/interface";
import SearchBar from "@/components/searchbar";
import TableActionButtons from "@/components/tableactionbuttons";
import Pagination from "@/components/pagination";
import InfoTable from "@/components/infotable";

const headers = [
    { field: "id", label: "ID", type: "number" },
    { field: "amount", label: "Amount", type: "money" },
    { field: "description", label: "Description", type: "string" },
    { field: "date", label: "Date", type: "date" },
    { field: "budgetid", label: "Budget ID", type: "string" },
];

export default function Projects() {
    const [data, setData] = useState<Expense[]>([]);
    const [filteredData, setFilteredData] = useState<Expense[]>([]);

    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 15;

    useEffect(() => {
        fetch("/api/expense")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then((data: APIExpenseResponse) => {
                setData(data.expenses);
                setFilteredData(data.expenses);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError(error.message);
            });
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = data.filter((expense) => expense.description.toLowerCase().includes(query.toLowerCase()));
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const handleSort = () => {
        const sortedData = [...filteredData].sort((a, b) => {
            const comparison = a.description.localeCompare(b.description);
            return sortOrder === "asc" ? comparison : -comparison;
        });
        setFilteredData(sortedData);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    if (error) {
        return (
            <p className="text-center text-sm font-medium" style={{ color: "var(--color-error)" }}>
                Error: {error}
            </p>
        );
    }
    
    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)]">
            <div className="flex justify-between">
                <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />
                <TableActionButtons />
            </div>

            <div className="flex-grow overflow-auto">
                <InfoTable
                    data={paginatedData}
                    headers={headers}
                    onSort={handleSort}
                />
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onFirstPage={() => setCurrentPage(1)}
                onPreviousPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                onNextPage={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                onLastPage={() => setCurrentPage(totalPages)}
            />
        </div>
    );

}
