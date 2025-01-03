"use client";

import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

const FormSchema = z.object({
    amount: z.number().positive("Amount must be a positive number"),
    description: z.string().nonempty("Description is required"),
    date: z.date().optional(),
    budgetid: z.number().positive("Budget ID must be a positive number"),
    categoryid: z.number().positive("Category ID must be a positive number"),
});

export default function CreateUpdateExpense({ selectedItems, handleCreateOrUpdate, refreshData }: {
    selectedItems: Set<number>;
    handleCreateOrUpdate: (value: boolean) => void;
    refreshData: () => void;
}) {
    const [budgets, setBudgets] = useState<{ id: number; name: string }[]>([]);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const isUpdate = selectedItems.size > 0;
    const selectedId = isUpdate ? Array.from(selectedItems)[0] : null;

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            amount: 0,
            description: "",
            date: new Date(),
            budgetid: 0,
            categoryid: 0,
        },
    });

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const response = await fetch("/api/budget");
                if (!response.ok) throw new Error("Failed to fetch budgets");
                const data = await response.json();
                setBudgets(data.budgets || []);
            } catch (error) {
                console.error("Error fetching budgets:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch("/api/category");
                if (!response.ok) throw new Error("Failed to fetch categories");
                const data = await response.json();
                setCategories(data.categories || []);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchBudgets();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (isUpdate && selectedId) {
            const fetchExpense = async () => {
                try {
                    console.log(`Fetching expense for ID: ${selectedId}`);
                    const res = await fetch(`/api/expense/${selectedId}`);
                    if (!res.ok) {
                        throw new Error(`Failed to fetch expense: ${res.statusText}`);
                    }
                    const data = await res.json();

                    if (data.expense) {
                        form.reset({
                            amount: data.expense.amount,
                            description: data.expense.description,
                            date: new Date(data.expense.date),
                            budgetid: data.expense.budgetid,
                            categoryid: data.expense.categoryid,
                        });
                    } else {
                        console.error("Expense not found");
                    }
                } catch (error) {
                    console.error("Error fetching expense:", error);
                }
            };
            fetchExpense();
        }
    }, [isUpdate, selectedId, form]);

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            const method = isUpdate ? "PUT" : "POST";
            const url = isUpdate ? `/api/expense/${selectedId}` : `/api/expense`;

            const body = {
                ...data,
                date: data.date?.toISOString().split('T')[0],
            };

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "Failed to save expense");
            }

            console.log("Expense saved successfully:", result);
            refreshData();
            handleCreateOrUpdate(false);
        } catch (error) {
            console.error("Error saving expense:", error);
        }
    };

    return (
        <DialogHeader>
            <DialogTitle>{isUpdate ? "Update Expense" : "Create New Expense"}</DialogTitle>
            <DialogDescription>
                {isUpdate ? "Update the expense details." : "Fill out the form to create a new expense."}
            </DialogDescription>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4">
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <div className="flex items-center border border-gray-300 rounded-md p-2">
                                        <Input
                                            type="number"
                                            placeholder="Enter amount"
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            className="w-full mr-2"
                                        />
                                        <span className="mr-2 text-gray-500">€</span>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Enter description"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                    <div className="flex justify-start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value || new Date()}
                                            onSelect={(selectedDate) => field.onChange(selectedDate)}
                                            className="rounded-md border shadow"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="budgetid"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Budget</FormLabel>
                                <FormControl>
                                    <select
                                        value={field.value || ""}
                                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                    >
                                        <option value="" disabled>
                                            Select a budget
                                        </option>
                                        {budgets.map((budget) => (
                                            <option key={budget.id} value={budget.id}>
                                                {budget.name}
                                            </option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="categoryid"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Budget</FormLabel>
                                <FormControl>
                                    <select
                                        value={field.value || ""}
                                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                    >
                                        <option value="" disabled>
                                            Select a Category
                                        </option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => handleCreateOrUpdate(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-primaryAccent hover:bg-primaryText text-white">
                            {isUpdate ? "Update" : "Submit"}
                        </Button>
                    </div>
                </form>
            </Form>
        </DialogHeader>
    );
}
