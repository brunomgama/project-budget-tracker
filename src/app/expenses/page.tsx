"use client";

/**
 * Import necessary hooks and components.
 * - `useEffect` and `useState` for state management and side effects.
 * - `SearchBar`, `TableActionButtons`, `Pagination`, and `InfoTable` for UI elements.
 */
import { useEffect, useState } from "react";
import { APIExpenseResponse, Expense } from "@/types/interfaces/interface";
import SearchBar from "@/components/searchbar";
import TableActionButtons from "@/components/tableactionbuttons";
import Pagination from "@/components/pagination";
import InfoTable from "@/components/infotable";

/**
 * Define table headers for the expenses table.
 * - Each header object contains `field`, `label`, and `type`.
 */
const headers = [
    { field: "id", label: "Expense Id", type: "number" },
    { field: "amount", label: "Amount", type: "money" },
    { field: "description", label: "Description", type: "string" },
    { field: "date", label: "Date", type: "date" },
    { field: "budgetid", label: "Budget", type: "string" },
    { field: "categoryid", label: "Category", type: "string" },
];

/**
 * Main component for displaying expenses.
 * - Handles data fetching, filtering, sorting, and pagination.
 */
export default function Expenses() {
    // State variables for storing expense data, mapping budget/category names, and handling errors.
    const [data, setData] = useState<Expense[]>([]);
    const [filteredData, setFilteredData] = useState<Expense[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [error, setError] = useState<string | null>(null);
    const [budgetMap, setBudgetMap] = useState<{ [key: number]: string }>({});
    const [categoryMap, setCategryMap] = useState<{ [key: number]: string }>({});

    // State variables for pagination and sorting.
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 15;

    /**
     * `useEffect` to trigger data fetching when the component mounts.
     * - Fetches budgets, categories, and expenses from the API.
     */
    useEffect(() => {
        fetchBudgets();
        fetchCategories();
        fetchData();
    }, []);

    /**
     * Fetch budget data from the `/api/budget` endpoint.
     * - Maps budget IDs to names for display purposes.
     * - Updates the `budgetMap` state.
     */
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

    /**
     * Fetch category data from the `/api/category` endpoint.
     * - Maps category IDs to names for display purposes.
     * - Updates the `categoryMap` state.
     */
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

    /**
     * Fetch expense data from the `/api/expense` endpoint.
     * - Updates `data` and `filteredData` states with the fetched expenses.
     * - Resets the selected items to an empty set.
     */
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

    /**
     * Handle the search input and filter the expense list.
     * - Filters expenses based on the search query (case-insensitive).
     * - Resets the current page to 1 when a search is performed.
     */
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = data.filter((expense) =>
            expense.description.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    /**
     * Handle sorting the expense list by description.
     * - Toggles between ascending and descending order.
     */
    const handleSort = () => {
        const sortedData = [...filteredData].sort((a, b) => {
            const comparison = a.description.localeCompare(b.description);
            return sortOrder === "asc" ? comparison : -comparison;
        });
        setFilteredData(sortedData);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    /**
     * Handle selecting an expense item.
     * - Allows single selection for update operations.
     * - If the item is already selected, deselect it.
     */
    const handleSelectItem = (id: number) => {
        if (selectedItems.has(id)) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set([id]));
        }
    };

    /**
     * Pagination calculations:
     * - Calculate the total number of pages based on the items per page.
     * - Slice the data to only show the current page's items.
     */
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    /**
     * Display an error message if there is an issue with data fetching.
     */
    if (error) {
        return (
            <p className="text-center text-sm font-medium" style={{ color: "var(--color-error)" }}>
                Error: {error}
            </p>
        );
    }

    /**
     * Render the expenses page.
     * - Includes a search bar, table action buttons, the expenses table, and pagination.
     */
    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)]">
            <div className="flex justify-between">
                <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />
                <TableActionButtons selectedItems={selectedItems} refreshData={fetchData} />
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
