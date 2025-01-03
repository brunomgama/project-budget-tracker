"use client";

import { useEffect, useState } from "react";
import {APICategoryResponse, Category} from "@/types/interfaces/interface";
import SearchBar from "@/components/searchbar";
import TableActionButtons from "@/components/tableactionbuttons";
import Pagination from "@/components/pagination";
import InfoTable from "@/components/infotable";

const headers = [
    { field: "id", label: "ID", type: "number" },
    { field: "name", label: "Name", type: "string" },
    { field: "color", label: "Color", type: "string" },
    { field: "projectid", label: "Project ID", type: "number" },
];

export default function Projects() {
    const [data, setData] = useState<Category[]>([]);
    const [filteredData, setFilteredData] = useState<Category[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 15;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch("/api/category")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then((data: APICategoryResponse) => {
                setData(data.categories);
                setFilteredData(data.categories);
                setSelectedItems(new Set());
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError(error.message);
            });
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = data.filter((category) => category.name.toLowerCase().includes(query.toLowerCase()));
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const handleSort = () => {
        const sortedData = [...filteredData].sort((a, b) => {
            const comparison = a.name.localeCompare(b.name);
            return sortOrder === "asc" ? comparison : -comparison;
        });
        setFilteredData(sortedData);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const handleSelectItem = (id: number) => {
        const newSelectedItems = new Set(selectedItems)

        if(newSelectedItems.has(id)) {
            newSelectedItems.delete(id);
        }
        else {
            newSelectedItems.add(id);
        }

        setSelectedItems(newSelectedItems)
    }

    const handleSelectAll = () => {
        if (selectedItems.size === filteredData.length) {
            setSelectedItems(new Set());
        } else {
            const allIds = new Set(filteredData.map((item) => item.id));
            setSelectedItems(allIds);
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
                    data={paginatedData}
                    headers={headers}
                    onSort={handleSort}
                    selectedItems={selectedItems}
                    onSelectItem={handleSelectItem}
                    onSelectAll={handleSelectAll}
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
