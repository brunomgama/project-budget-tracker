"use client";

import { useEffect, useState } from "react";
import {APIExpenseResponse, Expense} from "@/types/interfaces/interface";
import SearchBar from "@/components/searchbar";
import TableActionButtons from "@/components/tableactionbuttons";
import Pagination from "@/components/pagination";
import InfoTable from "@/components/infotable";

const headers = [
    { field: "id", label: "Expense Id", type: "number" },
    { field: "amount", label: "Amount", type: "money" },
    { field: "description", label: "Description", type: "string" },
    { field: "date", label: "Date", type: "date" },
    { field: "budgetid", label: "Budget", type: "string" },
    { field: "categoryid", label: "Category", type: "string" },
];

export default function Expenses() {
    const [data, setData] = useState<Expense[]>([]);
    const [filteredData, setFilteredData] = useState<Expense[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [error, setError] = useState<string | null>(null);
    const [budgetMap, setBudgetMap] = useState<{ [key: number]: string }>({});
    const [categoryMap, setCategryMap] = useState<{ [key: number]: string }>({});

    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 15;

    useEffect(() => {
        fetchBudgets();
        fetchCategories();
        fetchData();
    }, []);

    const fetchBudgets = () => {
        fetch("/api/budget")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch budgets");
                }
                return response.json();
            })
            .then((data) => {
                const map: { [key: number]: string } = {};
                data.budgets.forEach((budget: { id: number; name: string }) => {
                    map[budget.id] = budget.name;
                });
                setBudgetMap(map);
            })
            .catch((error) => {
                console.error("Error fetching budgets:", error);
                setError(error.message);
            });
    };

    const fetchCategories = () => {
        fetch("/api/category")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch categories");
                }
                return response.json();
            })
            .then((data) => {
                const map: { [key: number]: string } = {};
                data.categories.forEach((category: { id: number; name: string }) => {
                    map[category.id] = category.name;
                });
                setCategryMap(map);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
                setError(error.message);
            });
    };

    const fetchData = () => {
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
                setSelectedItems(new Set());
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError(error.message);
            });
    };

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

    const handleSelectItem = (id: number) => {
        if (selectedItems.has(id)) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set([id]));
        }
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
                <TableActionButtons selectedItems={selectedItems} refreshData={fetchData}/>
            </div>

            <div className="flex-grow overflow-auto">
                <InfoTable
                    data={paginatedData.map((expense) => ({
                        ...expense,
                        budgetid: budgetMap[expense.budgetid] || "Unknown Budget",
                        categoryid: categoryMap[expense.categoryid] || "Unknown Category",
                    }))}
                    headers={headers}
                    onSort={handleSort}
                    selectedItems={selectedItems}
                    onSelectItem={handleSelectItem}
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
