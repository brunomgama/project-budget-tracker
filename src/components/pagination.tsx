/**
 * Pagination Component:
 * Provides pagination controls to navigate between pages of data.
 * - Props:
 *   - `currentPage`: The current page number.
 *   - `totalPages`: The total number of pages.
 *   - `onFirstPage`: Function to navigate to the first page.
 *   - `onPreviousPage`: Function to navigate to the previous page.
 *   - `onNextPage`: Function to navigate to the next page.
 *   - `onLastPage`: Function to navigate to the last page.
 */

import { Button } from "@/components/ui/button";

export default function Pagination({
                                       currentPage,
                                       totalPages,
                                       onFirstPage,
                                       onPreviousPage,
                                       onNextPage,
                                       onLastPage,
                                   }: {
    currentPage: number;
    totalPages: number;
    onFirstPage: () => void;
    onPreviousPage: () => void;
    onNextPage: () => void;
    onLastPage: () => void;
}) {
    return (
        <div className="sticky bottom-0 border-t border-gray-200 pt-4 pb-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                </p>

                <div className="flex space-x-2">
                    <Button variant="outline" onClick={onFirstPage} disabled={currentPage === 1} className="text-sm">
                        {"<<"}
                    </Button>

                    <Button variant="outline" onClick={onPreviousPage} disabled={currentPage === 1} className="text-sm">
                        {"<"}
                    </Button>

                    <Button variant="outline" onClick={onNextPage} disabled={currentPage === totalPages} className="text-sm">
                        {">"}
                    </Button>

                    <Button variant="outline" onClick={onLastPage} disabled={currentPage === totalPages} className="text-sm">
                        {">>"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
