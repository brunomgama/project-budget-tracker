import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Header {
    field: string;
    label: string;
    type: string;
}

export default function InfoTable(
    {data, headers, onSort, selectedItems, onSelectItem}:
    {
        data: Record<string, any>[];
        headers: Header[];
        onSort: (key: string) => void;
        selectedItems: Set<number>;
        onSelectItem: (id: number) => void;
    }) {
    return (
        <Table className="min-w-full">
            <TableHeader>
                <TableRow>
                    <TableHead>
                        {/* Empty header for checkbox */}
                    </TableHead>
                    {headers.map((header) => (
                        <TableHead key={header.field} className="cursor-pointer" onClick={() => onSort(header.field)}>
                            {header.label}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.length > 0 ? (
                    data.map((row, index) => (
                        <TableRow key={index} className="cursor-pointer" onClick={() => onSelectItem(row.id)}>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.has(row.id)}
                                    onChange={() => onSelectItem(row.id)}
                                />
                            </TableCell>
                            {headers.map((header) => (
                                <TableCell key={header.field}>
                                    {header.type === "money"
                                        ? `${parseFloat(row[header.field]).toFixed(2)} €`
                                        : row[header.field] ?? "N/A"}
                                </TableCell>
                            ))}
                        </TableRow>

                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={headers.length + 1} className="text-center py-6">
                            No data available.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
