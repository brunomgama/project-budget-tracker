/**
 * `InfoTable` component:
 * A dynamic table for displaying tabular data with headers and sorting capabilities.
 * - Props:
 *   - `data`: Array of records to display.
 *   - `headers`: Array of header objects defining the table columns.
 *   - `onSort`: Optional function for sorting the table by column.
 *   - `selectedItems`: Set of selected item IDs.
 *   - `onSelectItem`: Function triggered when a table row checkbox is selected.
 */
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Header {
    field: string;
    label: string;
    type: string;
}

interface Identifiable {
    id: number;
}

export default function InfoTable<T extends Identifiable>(
    { data, headers, onSort, selectedItems, onSelectItem }:
        {
            data: T[];
            headers: Header[];
            onSort?: (key: keyof T) => void;
            selectedItems: Set<number>;
            onSelectItem: (id: number) => void;
        }
) {
    return (
        /**
         * Table container:
         * - `min-w-full`: Ensures the table spans the full width of its container.
         */
        <Table className="min-w-full">
            {/* Table header with sortable column headings */}
            <TableHeader>
                <TableRow>
                    <TableHead>{/* Empty header for checkboxes */}</TableHead>
                    {headers.map((header) => (
                        <TableHead
                            key={header.field}
                            className={`cursor-pointer ${onSort ? "hover:text-blue-600" : ""}`}
                            onClick={() => {
                                if (onSort) {
                                    onSort(header.field as keyof T);
                                }
                            }}
                        >
                            {header.label}
                            {onSort && <span className="ml-1 text-sm text-gray-400">↕</span>}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>

            {/* Table body containing rows of data */}
            <TableBody>
                {data.length > 0 ? (
                    data.map((row) => (
                        <TableRow key={row.id} className="cursor-pointer" onClick={() => onSelectItem(row.id)}>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                                {/* Checkbox for selecting a row */}
                                <input
                                    type="checkbox"
                                    checked={selectedItems.has(row.id)}
                                    onChange={() => onSelectItem(row.id)}
                                />
                            </TableCell>
                            {headers.map((header) => (
                                <TableCell key={header.field}>
                                    {/* Render currency or default value based on header type */}
                                    {header.type === "money"
                                        ? `${parseFloat((row[header.field as keyof T] as number | string)?.toString() || "0").toFixed(2)} €`
                                        : row[header.field as keyof T]?.toString() || "N/A"}
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
