"use client";

/**
 * Import necessary hooks and components for the page.
 * - `useEffect` and `useState` for state management and side effects.
 * - Components like `SearchBar`, `TableActionButtons`, `Pagination`, and `InfoTable` for UI elements.
 */
import { useEffect, useState } from "react";
import {APIBudgetResponse, Budget, DisplayBudget} from "@/types/interfaces/interface";
import SearchBar from "@/components/searchbar";
import TableActionButtons from "@/components/tableactionbuttons";
import Pagination from "@/components/pagination";
import InfoTable from "@/components/infotable";

/**
 * Define the headers for the budget table.
 * - Each header object contains the `field`, `label`, and `type`.
 */
const headers = [
    { field: "id", label: "Budget Id", type: "number" },
    { field: "name", label: "Name", type: "string" },
    { field: "totalamount", label: "Total Amount", type: "money" },
    { field: "projectid", label: "Project", type: "string" },
    { field: "categoryid", label: "Category", type: "string" },
];

/**
 * Main component that displays the budget list.
 * - Handles data fetching, filtering, sorting, and pagination.
 */
export default function Projects() {
    // State variables for storing budget data, related projects, and categories.
    const [data, setData] = useState<Budget[]>([]);
    const [projects, setProjects] = useState<{ [key: number]: string }>({});
    const [categories, setCategories] = useState<{ [key: number]: string }>({});
    const [filteredData, setFilteredData] = useState<Budget[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [error, setError] = useState<string | null>(null);

    // State variables for pagination and sorting.
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 15;

    /**
     * `useEffect` to trigger data fetching on component mount.
     * - Fetches budgets, projects, and categories.
     */
    useEffect(() => {
        fetchData();
        fetchProjects();
        fetchCategories();
    }, []);

    /**
     * Fetch budget data from the API.
     * - Updates `data` and `filteredData` states.
     * - Handles API errors and updates the `error` state if the fetch fails.
     */
    const fetchData = () => {
        fetch("/api/budget")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then((data: APIBudgetResponse) => {
                setData(data.budgets);
                setFilteredData(data.budgets);
                setSelectedItems(new Set());
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError(error.message);
            });
    };

    /**
     * Fetch project names to display in the table.
     * - Maps project IDs to names for display purposes.
     */
    const fetchProjects = () => {
        fetch("/api/project")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch project data");
                }
                return response.json();
            })
            .then((data: { projects: { id: number; name: string }[] }) => {
                const projectMap: { [key: number]: string } = {};
                data.projects.forEach((project) => {
                    projectMap[project.id] = project.name;
                });
                setProjects(projectMap);
            })
            .catch((error) => {
                console.error("Error fetching projects:", error);
            });
    };

    /**
     * Fetch category names to display in the table.
     * - Maps category IDs to names for display purposes.
     */
    const fetchCategories = () => {
        fetch("/api/category")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch category data");
                }
                return response.json();
            })
            .then((data: { categories: { id: number; name: string }[] }) => {
                const categoryMap: { [key: number]: string } = {};
                data.categories.forEach((category) => {
                    categoryMap[category.id] = category.name;
                });
                setCategories(categoryMap);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    };

    /**
     * Handle search input to filter the budget list.
     * - Filters budgets based on the search query (case-insensitive).
     */
    const handleSearch = (query: string) => {
        setSearchQuery(query);

        const lowerCaseQuery = query.toLowerCase();
        const isNumericQuery = !isNaN(Number(query));

        const filtered = data.filter((item) =>
            headers.some((header) => {
                const fieldValue = item[header.field as keyof Budget];

                if (fieldValue === null || fieldValue === undefined) return false;

                if (header.type === "number" || header.type === "money") {
                    return isNumericQuery && fieldValue.toString().includes(query);
                }

                if (header.type === "string" || header.type === "description") {
                    return fieldValue.toString().toLowerCase().includes(lowerCaseQuery);
                }

                if (header.type === "date") {
                    const formattedDate = new Date(fieldValue).toLocaleDateString();
                    return formattedDate.includes(query);
                }

                return false;
            })
        );

        setFilteredData(filtered);
        setCurrentPage(1);
    };

    /**
     * Handle sorting by the budget name field.
     * - Toggles between ascending and descending order.
     */
    const handleSort = (key: keyof Budget) => {
        const sortedData = [...filteredData].sort((a, b) => {
            // Sort numbers and strings differently
            if (typeof a[key] === "number" && typeof b[key] === "number") {
                return sortOrder === "asc" ? a[key] - b[key] : b[key] - a[key];
            } else {
                return sortOrder === "asc"
                    ? a[key]?.toString().localeCompare(b[key]?.toString())
                    : b[key]?.toString().localeCompare(a[key]?.toString());
            }
        });
        setFilteredData(sortedData);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    /**
     * Handle selecting a budget item.
     * - Allows single selection for updates.
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
     * - Calculate the total number of pages.
     * - Slice the data based on the current page and items per page.
     */
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage).map((budget) => ({
        ...budget,
        projectid: projects[budget.projectid] || "Unknown Project",
        categoryid: categories[budget.categoryid] || "Unknown Category",
    }));

    /**
     * If an error occurs during data fetching, display the error message.
     */
    if (error) {
        return (
            <p className="text-center text-sm font-medium" style={{ color: "var(--color-error)" }}>
                Error: {error}
            </p>
        );
    }

    /**
     * Render the budget page.
     * - Includes a search bar, table action buttons, the budget table, and pagination.
     */
    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)]">
            <div className="flex justify-between">
                <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />
                <TableActionButtons selectedItems={selectedItems} refreshData={fetchData} />
            </div>

            <div className="flex-grow overflow-auto">
                <InfoTable<DisplayBudget>
                    data={paginatedData}
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
