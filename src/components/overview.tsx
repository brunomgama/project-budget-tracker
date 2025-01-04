/**
 * `Overview` component:
 * Displays an overview section with a table of project data and a radial chart showing the budget overview.
 * - Props:
 *   - `paginatedData`: Array of project records for the current page.
 *   - `headers`: Array of header definitions for the table.
 *   - `currentPage`: Current page index for pagination.
 *   - `totalPages`: Total number of pages.
 *   - `selectedItems`: Set of selected project IDs.
 *   - `handleSelectItem`: Function triggered when a project is selected.
 *   - `setCurrentPage`: Function to change the current page.
 *   - `chartData`: Data for the radial chart.
 *   - `totalBudget`: Total budget amount to display in the chart description.
 */

"use client";

import TableOverview from "@/components/tableoverview";
import { RadialChartComponent } from "@/components/graphs/radialchart";
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
        /**
         * Container:
         * - `flex`: Flexbox layout for side-by-side display.
         * - `mt-6`: Adds top margin for spacing.
         */
        <div className="flex mt-6">
            {/* Left Section: Table Overview */}
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

            {/* Right Section: Radial Chart */}
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