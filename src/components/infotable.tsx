import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Header {
    field: string;
    label: string;
    type: string;
}

export default function InfoTable(
    {data, headers, onSort}:
    { data: Record<string, any>[]; headers: Header[]; onSort: (key: string) => void; }) {
    return (
        <Table className="min-w-full">
            <TableHeader>
                <TableRow>
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
                        <TableRow key={index}>
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
                        <TableCell colSpan={headers.length} className="text-center py-6">
                            No data available.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
