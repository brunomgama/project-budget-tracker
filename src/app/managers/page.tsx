"use client";

/**
 * Import necessary hooks and components.
 * - `useEffect` and `useState` for managing state and side effects.
 * - `SearchBar`, `TableActionButtons`, `Pagination`, and `InfoTable` for UI components.
 */
import { useEffect, useState } from "react";
import {APIManagerResponse, Manager, Project} from "@/types/interfaces/interface";
import SearchBar from "@/components/searchbar";
import TableActionButtons from "@/components/tableactionbuttons";
import Pagination from "@/components/pagination";
import InfoTable from "@/components/infotable";

/**
 * Define table headers for displaying manager data.
 * - Specifies the field name, label, and type of data.
 */
const headers = [
    { field: "id", label: "Manager Id", type: "number" },
    { field: "name", label: "Name", type: "string" },
];

/**
 * Main component for displaying and managing managers.
 * - Handles data fetching, filtering, sorting, and pagination.
 */
export default function Projects() {
    // State variables for storing and managing manager data.
    const [data, setData] = useState<Manager[]>([]);
    const [filteredData, setFilteredData] = useState<Manager[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [error, setError] = useState<string | null>(null);

    // State variables for pagination and sorting.
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 15;

    /**
     * Fetch manager data when the component mounts.
     * - Calls the `fetchData` function to retrieve data from the API.
     */
    useEffect(() => {
        fetchData();
    }, []);

    /**
     * Fetch manager data from the `/api/manager` endpoint.
     * - Updates `data` and `filteredData` states with the fetched managers.
     * - Resets selected items after data is fetched.
     */
    const fetchData = () => {
        fetch("/api/manager")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then((data: APIManagerResponse) => {
                setData(data.managers);
                setFilteredData(data.managers);
                setSelectedItems(new Set());
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError(error.message);
            });
    };

    /**
     * Handle search input to filter the manager list.
     * - Filters managers based on the search query (case-insensitive).
     * - Resets the current page to 1 when a search is performed.
     */
    const handleSearch = (query: string) => {
        setSearchQuery(query);

        const lowerCaseQuery = query.toLowerCase();
        const isNumericQuery = !isNaN(Number(query));

        const filtered = data.filter((item) =>
            headers.some((header) => {
                const fieldValue = item[header.field as keyof Manager];

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
     * Handle sorting the manager list by name.
     * - Toggles between ascending and descending order.
     */
    const handleSort = (key: keyof Project) => {
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
     * Handle selecting a manager item.
     * - Allows single selection for update operations.
     * - Deselects the item if it is already selected.
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
     * Render the manager list page.
     * - Includes a search bar, table action buttons, manager table, and pagination controls.
     */
    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)]">
            <div className="flex justify-between">
                <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />
                <TableActionButtons selectedItems={selectedItems} refreshData={fetchData}/>
            </div>

            <div className="flex-grow overflow-auto">
                <InfoTable<Manager>
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
