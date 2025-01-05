"use client";

import { useEffect, useState } from "react";

const files = [
    {
        label: "Budget Tracking Report",
        pdfPath: "/textextract/Budget_Tracking_Report/Budget_Tracking_Report.pdf",
        queryCSV: "/textextract/Budget_Tracking_Report/queryAnswers.csv",
        tableCSV: "/textextract/Budget_Tracking_Report/table-1.csv",
        layoutCSV: "/textextract/Budget_Tracking_Report/layout.csv",
    },
];

export default function Upload() {
    const [selectedFile, setSelectedFile] = useState<typeof files[0] | null>(null);
    const [selectedTab, setSelectedTab] = useState<"table" | "query" | "layout">("query");
    const [csvData, setCsvData] = useState<any[]>([]);
    const [pdfFile, setPdfFile] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIndex = e.target.selectedIndex - 1;
        if (selectedIndex >= 0) {
            const newFile = files[selectedIndex];
            setSelectedFile(newFile);
            setPdfFile(newFile.pdfPath);
        } else {
            setSelectedFile(null);
            setPdfFile(null);
            setCsvData([]);
        }
    };

    const fetchCSVData = async (filePath: string) => {
        try {
            const response = await fetch(filePath);
            const csvText = await response.text();
            return parseCSV(csvText);
        } catch (error) {
            console.error("Error loading CSV file:", error);
            return [];
        }
    };

    const parseCSV = (csvText: string) => {
        const lines = csvText.trim().split("\n");
        const headers = lines[0].split(";").map((header) => header.replace(/['"]+/g, "").trim());
        const data = lines.slice(1).map((line) => {
            const values = line.split(";").map((value) => value.replace(/['"]+/g, "").trim());
            const row: { [key: string]: string } = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || "";
            });
            return row;
        });
        return data;
    };

    useEffect(() => {
        if (!selectedFile) return;

        let csvPath = "";
        switch (selectedTab) {
            case "query":
                csvPath = selectedFile.queryCSV;
                break;
            case "table":
                csvPath = selectedFile.tableCSV;
                break;
            case "layout":
                csvPath = selectedFile.layoutCSV;
                break;
        }
        fetchCSVData(csvPath).then((data) => setCsvData(data));
    }, [selectedTab, selectedFile]);

    const renderTable = (data: any[]) => (
        <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
            <tr className="bg-gray-200">
                {Object.keys(data[0] || {}).map((header, index) => (
                    <th key={index} className="border border-gray-300 p-2">
                        {header}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map((row, index) => (
                <tr key={index} className="odd:bg-white even:bg-gray-100">
                    {Object.values(row).map((value, i) => (
                        <td key={i} className="border border-gray-300 p-2">
                            {typeof value === "string" || typeof value === "number" ? value : ""}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Upload and View File</h1>

            <div className="flex gap-6">
                <div className="w-1/2 p-4 border border-gray-300 rounded bg-gray-50">
                    <h2 className="text-lg font-semibold mb-2">Document Preview</h2>
                    {pdfFile ? (
                        <iframe src={pdfFile} className="w-full h-[80vh] border rounded" title="PDF Preview" />
                    ) : (
                        <p className="text-gray-500">No PDF preview available.</p>
                    )}
                </div>

                <div className="w-1/2">
                    <select
                        className="border p-2 rounded mb-4 w-full"
                        onChange={handleFileChange}
                        value={selectedFile?.label || ""}
                    >
                        <option value="">Select a document...</option>
                        {files.map((file, index) => (
                            <option key={index} value={file.label}>
                                {file.label}
                            </option>
                        ))}
                    </select>
                    {selectedFile ? (
                        <>
                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={() => setSelectedTab("query")}
                                    className={`p-2 rounded ${selectedTab === "query" ? "bg-indigo-500 text-white" : "bg-gray-200"}`}
                                >
                                    Query
                                </button>
                                <button
                                    onClick={() => setSelectedTab("table")}
                                    className={`p-2 rounded ${selectedTab === "table" ? "bg-indigo-500 text-white" : "bg-gray-200"}`}
                                >
                                    Table
                                </button>
                                <button
                                    onClick={() => setSelectedTab("layout")}
                                    className={`p-2 rounded ${selectedTab === "layout" ? "bg-indigo-500 text-white" : "bg-gray-200"}`}
                                >
                                    Layout
                                </button>
                            </div>

                            {csvData.length > 0 ? (
                                renderTable(csvData)
                            ) : (
                                <p className="text-gray-500 mt-4">No data available for the selected tab.</p>
                            )}
                        </>
                    ) : (
                        <p className="text-gray-500">Please select a document to view data.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
