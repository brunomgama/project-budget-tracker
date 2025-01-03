"use client";

import TableOverview from "@/components/tableoverview";
import {RadialChartComponent} from "@/components/graphs/radialchart";
import { Project } from "@/types/interfaces/interface";

export default function Overview({
                                     paginatedData,
                                     headers,
                                     currentPage,
                                     totalPages,
                                     selectedItems,
                                     handleSelectItem,
                                     setCurrentPage,
                                     chartData,
                                     totalBudget,
                                 }: {
    paginatedData: Project[];
    headers: { field: string; label: string; type: string }[];
    currentPage: number;
    totalPages: number;
    selectedItems: Set<number>;
    handleSelectItem: (id: number) => void;
    setCurrentPage: (page: number) => void;
    chartData: { label: string; percentage: number; value: number; fill: string }[];
    totalBudget: number;
}) {
    return (
        <div className="flex mt-6">
            <div className="w-1/2 pr-4">
                <TableOverview
                    data={paginatedData}
                    headers={headers}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    selectedItems={selectedItems}
                    handleSelectItem={handleSelectItem}
                    setCurrentPage={setCurrentPage}
                />
            </div>

            <div className="w-1/2 pl-4">
                <RadialChartComponent
                    chartData={chartData}
                    title="Budget Overview"
                    description={`Total Budget: ${totalBudget.toLocaleString()} €`}
                />
            </div>
        </div>
    );
}
