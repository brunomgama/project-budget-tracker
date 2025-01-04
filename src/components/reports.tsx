"use client";

import TableOverview from "@/components/tableoverview";
import { Category, Expense, Project, Budget } from "@/types/interfaces/interface";
import { useState, useEffect } from "react";

export default function Reports({
                                    paginatedData,
                                    headers,
                                    currentPage,
                                    totalPages,
                                    selectedItems,
                                    handleSelectItem,
                                    setCurrentPage,
                                    expenses,
                                    categories,
                                    budgets,
                                }: {
    paginatedData: Project[];
    headers: { field: string; label: string; type: string }[];
    currentPage: number;
    totalPages: number;
    selectedItems: Set<number>;
    handleSelectItem: (id: number) => void;
    setCurrentPage: (page: number) => void;
    expenses: Expense[];
    categories: Category[];
    budgets: Budget[];
}) {
    const selectedProjectId = Array.from(selectedItems)[0];
    const selectedProject = paginatedData.find((project) => project.id === selectedProjectId);

    const [filteredBudgets, setFilteredBudgets] = useState<Budget[]>([]);
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);

    useEffect(() => {
        if (selectedProjectId) {
            const projectBudgets = budgets.filter((budget) => budget.projectid === selectedProjectId);
            setFilteredBudgets(projectBudgets);

            const expenseData = expenses.filter((expense) =>
                projectBudgets.some((budget) => budget.id === expense.budgetid)
            );
            setFilteredExpenses(expenseData);
        } else {
            setFilteredBudgets([]);
            setFilteredExpenses([]);
        }
    }, [selectedProjectId, budgets, expenses]);

    return (
        <div className="flex mt-6 gap-4">
            <div className="w-1/3 pr-4">
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

            <div className="w-2/3 h-screen max-h-[calc(75vh)] bg-white rounded-lg shadow-lg overflow-y-auto p-6">
                {selectedProject ? (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">{selectedProject.name}</h2>
                        <p className="text-gray-600">Project ID: {selectedProject.id}</p>

                        <div className="mt-6 border-t border-gray-300 pt-4">
                            <h3 className="font-semibold text-lg">Budget Details</h3>
                            {filteredBudgets.length > 0 ? (
                                <div className="mt-4">
                                    {filteredBudgets.map((budget) => (
                                        <div
                                            key={budget.id}
                                            className="flex justify-between items-center bg-indigo-100 rounded-lg p-4 mb-2"
                                        >
                                            <div>
                                                <p className="font-medium">{budget.name}</p>
                                                <p className="text-gray-500 text-sm">
                                                    Category:{" "}
                                                    {categories.find((cat) => cat.id === budget.categoryid)?.name || "N/A"}
                                                </p>
                                            </div>
                                            <p className="text-xl font-bold">{budget.totalamount.toLocaleString()} €</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600 mt-2">No budgets available for this project.</p>
                            )}
                        </div>

                        <div className="mt-6 border-t border-gray-300 pt-4">
                            <h3 className="font-semibold text-lg">Expense Details</h3>
                            {filteredExpenses.length > 0 ? (
                                <div className="mt-4 space-y-4">
                                    {filteredExpenses.map((expense) => (
                                        <div key={expense.id} className="bg-gray-100 rounded-lg p-4 shadow-sm">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm text-gray-700">Description</p>
                                                    <p className="font-medium">{expense.description || "No description"}</p>
                                                </div>
                                                <p className="text-lg font-bold">{expense.amount.toFixed(2)} €</p>
                                            </div>
                                            <div className="mt-2 flex justify-between text-sm text-gray-600">
                                    <span>
                                        Budget:{" "}
                                        {filteredBudgets.find((b) => b.id === expense.budgetid)?.name || "N/A"}
                                    </span>
                                                <span>Date: {new Date(expense.date).toLocaleDateString()}</span>
                                                <span>
                                        Category:{" "}
                                                    {categories.find((cat) => cat.id === expense.categoryid)?.name || "N/A"}
                                    </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600 mt-2">No expenses available for this project.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                        <p className="text-gray-600">Select a project to see details.</p>
                    </div>
                )}
            </div>

        </div>
    );
}
