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
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

const FormSchema = z.object({
    amount: z.number().positive("Amount must be a positive number"),
    description: z.string().nonempty("Description is required"),
    date: z.string().nonempty("Date is required"),
    budgetid: z.number().positive("Budget ID must be a positive number"),
});

export default function CreateUpdateExpense({ selectedItems, handleCreateOrUpdate, refreshData }: {
    selectedItems: Set<number>;
    handleCreateOrUpdate: (value: boolean) => void;
    refreshData: () => void;
}) {
    const isUpdate = selectedItems.size > 0;
    const selectedId = isUpdate ? Array.from(selectedItems)[0] : null;

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            amount: 0,
            description: "",
            date: "",
            budgetid: 0,
        },
    });

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
                            date: data.expense.date,
                            budgetid: data.expense.budgetid,
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
                amount: parseFloat(data.amount.toString()),
                description: data.description,
                date: data.date,
                budgetid: parseInt(data.budgetid.toString(), 10),
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
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="Enter amount"
                                        value={field.value || ""}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                    />
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
                                    <Input
                                        type="date"
                                        placeholder="Select date"
                                        {...field}
                                    />
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
                                <FormLabel>Budget ID</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Enter associated budget ID"
                                        value={field.value || ""}
                                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                    />
                                </FormControl>
                                <FormMessage />
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
