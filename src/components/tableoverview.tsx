import InfoTable from "@/components/infotable";
import Pagination from "@/components/pagination";

export default function TableOverview({
                                          data,
                                          headers,
                                          currentPage,
                                          totalPages,
                                          selectedItems,
                                          handleSelectItem,
                                          setCurrentPage,
                                      }: {
                                            data: any[];
                                            headers: { field: string; label: string; type: string }[];
                                            currentPage: number;
                                            totalPages: number;
                                            selectedItems: Set<number>;
                                            handleSelectItem: (id: number) => void;
                                            setCurrentPage: (page: number) => void;
}) {
    const handlePreviousPage = () => {
        const newPage = Math.max(currentPage - 1, 1);
        setCurrentPage(newPage);
    };

    const handleNextPage = () => {
        const newPage = Math.min(currentPage + 1, totalPages);
        setCurrentPage(newPage);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-auto">
                <InfoTable
                    data={data}
                    headers={headers}
                    selectedItems={selectedItems}
                    onSelectItem={handleSelectItem}
                />
            </div>
            <div className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onFirstPage={() => setCurrentPage(1)}
                    onPreviousPage={handlePreviousPage}
                    onNextPage={handleNextPage}
                    onLastPage={() => setCurrentPage(totalPages)}
                />
            </div>
        </div>
    );
}
