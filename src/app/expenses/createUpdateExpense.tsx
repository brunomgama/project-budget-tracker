"use client";

/**
 * Import necessary components and hooks.
 * - Dialog components for displaying the header, title, and description.
 * - Form components for handling input fields, validation, and submission.
 * - UI components for input, buttons, and the calendar date picker.
 */
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useEffect, useState } from "react";

/**
 * Define the form schema for validation using Zod.
 * - Validates each field to ensure correct data types and constraints.
 */
const FormSchema = z.object({
    amount: z.coerce.number().positive("Amount must be a positive number"),
    description: z.string().nonempty("Description is required"),
    date: z.date(),
    projectid: z.number().positive("Project ID must be selected"),
    budgetid: z.number().positive("Budget ID must be a positive number"),
    categoryid: z.number().positive("Category ID must be a positive number"),
});

/**
 * Main component for creating or updating an expense.
 * - Props:
 *   - selectedItems: set of selected expense IDs.
 *   - handleCreateOrUpdate: function to close the form dialog.
 *   - refreshData: function to refresh the expense data.
 */
export default function CreateUpdateExpense({ selectedItems, handleCreateOrUpdate, refreshData }: {
    selectedItems: Set<number>;
    handleCreateOrUpdate: (value: boolean) => void;
    refreshData: () => void;
}) {
    // State variables for storing project, budget, and category lists.
    const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
    const [budgets, setBudgets] = useState<{ id: number; name: string; projectid: number }[]>([]);
    const [filteredBudgets, setFilteredBudgets] = useState<{ id: number; name: string }[]>([]);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

    // Determine if this is an update operation and get the selected ID.
    const isUpdate = selectedItems.size > 0;
    const selectedId = isUpdate ? Array.from(selectedItems)[0] : null;

    // Initialize the form with default values and validation schema.
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            amount: 0,
            description: "",
            date: new Date(),
            projectid: 0,
            budgetid: 0,
            categoryid: 0,
        },
    });

    /**
     * Fetch the list of projects, budgets, and categories when the component mounts.
     * - Populates the state variables with data from the API.
     */
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch("/api/project");
                if (!response.ok) throw new Error("Failed to fetch projects");
                const data = await response.json();
                setProjects(data.projects || []);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

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

        fetchProjects();
        fetchBudgets();
        fetchCategories();
    }, []);

    /**
     * Filter budgets based on the selected project.
     * - Updates the list of budgets to show only those belonging to the selected project.
     */
    useEffect(() => {
        if (selectedProjectId) {
            const projectBudgets = budgets.filter((budget) => budget.projectid === selectedProjectId);
            setFilteredBudgets(projectBudgets);
        } else {
            setFilteredBudgets([]);
        }
    }, [selectedProjectId, budgets]);

    /**
     * Fetch the expense details if this is an update operation.
     * - Pre-fills the form with existing expense data if a selected ID is provided.
     */
    useEffect(() => {
        if (isUpdate && selectedId) {
            const fetchExpense = async () => {
                try {
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
                            projectid: data.expense.projectid,
                            budgetid: data.expense.budgetid,
                            categoryid: data.expense.categoryid,
                        });
                        setSelectedProjectId(data.expense.projectid);
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

    /**
     * Handle form submission for creating or updating an expense.
     * - Sends a POST request for creating a new expense.
     * - Sends a PUT request for updating an existing expense.
     */
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            const method = isUpdate ? "PUT" : "POST";
            const url = isUpdate ? `/api/expense/${selectedId}` : `/api/expense`;

            const body = {
                ...data,
                date: data.date?.toISOString().split('T')[0], // Format date to "YYYY-MM-DD".
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

            // Successfully saved the expense.
            console.log("Expense saved successfully:", result);
            refreshData();
            handleCreateOrUpdate(false);
        } catch (error) {
            console.error("Error saving expense:", error);
        }
    };

    /**
     * Render the expense form inside a dialog.
     * - Includes fields for amount, description, date, project, budget, and category.
     */
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
                                    <Input type="text" placeholder="Enter description" {...field} />
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
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full text-left">
                                                {field.value ? format(field.value, "yyyy-MM-dd") : "Select Date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value || new Date()}
                                                onSelect={(selectedDate) => field.onChange(selectedDate)}
                                                className="rounded-md border shadow"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="projectid"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Project</FormLabel>
                                <FormControl>
                                    <select
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            const projectId = parseInt(e.target.value, 10);
                                            field.onChange(projectId);
                                            setSelectedProjectId(projectId);
                                        }}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                    >
                                        <option value="" disabled>
                                            Select a project
                                        </option>
                                        {projects.map((project) => (
                                            <option key={project.id} value={project.id}>
                                                {project.name}
                                            </option>
                                        ))}
                                    </select>
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
                                        {filteredBudgets.map((budget) => (
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
                                <FormLabel>Category</FormLabel>
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
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleCreateOrUpdate(false)}
                        >
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
