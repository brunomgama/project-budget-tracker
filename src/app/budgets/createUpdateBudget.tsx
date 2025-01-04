"use client";

/**
 * Import necessary components and hooks.
 * - Dialog components for the header, title, and description.
 * - Button for form actions.
 * - Zod for schema validation.
 * - useForm from React Hook Form for form control.
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
import { useEffect, useState } from "react";
import { Project } from "@/types/interfaces/interface";
import { Input } from "@/components/ui/input";

/**
 * Define the form schema using Zod to validate form input.
 * - name: required string.
 * - totalamount: required positive number.
 * - projectid: required positive number for the selected project.
 * - categoryid: required positive number for the selected category.
 */
const FormSchema = z.object({
    name: z.string().nonempty("Name is required"),
    totalamount: z.coerce.number().positive("Total amount must be a positive number"),
    projectid: z.coerce.number().positive("Project ID must be a positive number"),
    categoryid: z.coerce.number().positive("Category ID must be a positive number"),
});

/**
 * Component for creating or updating a budget.
 * Props:
 * - selectedItems: set of selected budget IDs.
 * - handleCreateOrUpdate: function to close the dialog and refresh the data.
 * - refreshData: function to refresh the list of budgets after an operation.
 */
export default function CreateUpdateBudget({
                                               selectedItems,
                                               handleCreateOrUpdate,
                                               refreshData,
                                           }: {
    selectedItems: Set<number>;
    handleCreateOrUpdate: (value: boolean) => void;
    refreshData: () => void;
}) {
    // Determine whether we are updating an existing budget or creating a new one.
    const isUpdate = selectedItems.size > 0;
    const selectedId = isUpdate ? Array.from(selectedItems)[0] : null;

    // State to store the list of projects and categories.
    const [projects, setProjects] = useState<Project[]>([]);
    const [categories, setCategories] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);

    // Initialize the form with default values and schema validation.
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            totalamount: 0,
            projectid: 0,
            categoryid: 0,
        },
    });

    /**
     * Fetch the list of projects and categories when the component mounts.
     * - Fetches data from `/api/project` and `/api/category`.
     * - Sets appropriate form errors if the fetch fails.
     */
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch("/api/project");
                const data = await res.json();

                if (!res.ok) {
                    throw new Error("Failed to fetch projects");
                }

                setProjects(data.projects);
            } catch (error) {
                console.error("Error fetching projects:", error);
                form.setError("projectid", { message: "Error loading projects." });
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/category");
                const data = await res.json();

                if (!res.ok) {
                    throw new Error("Failed to fetch categories");
                }

                setCategories(data.categories);
            } catch (error) {
                console.error("Error fetching categories:", error);
                form.setError("categoryid", { message: "Error loading categories." });
            }
        };

        fetchProjects();
        fetchCategories();
    }, []);

    /**
     * If updating an existing budget, fetch the budget details.
     * - Populates the form with the existing budget data.
     */
    useEffect(() => {
        if (isUpdate && selectedId) {
            const fetchBudget = async () => {
                try {
                    const res = await fetch(`/api/budget/${selectedId}`);
                    if (!res.ok) {
                        throw new Error(`Failed to fetch budget: ${res.statusText}`);
                    }
                    const data = await res.json();

                    if (data.budget) {
                        form.reset({
                            name: data.budget.name,
                            totalamount: data.budget.totalamount,
                            projectid: data.budget.projectid,
                            categoryid: data.budget.categoryid,
                        });
                    } else {
                        form.setError("name", { message: "Budget not found." });
                    }
                } catch (error) {
                    console.error("Error fetching budget:", error);
                    form.setError("name", { message: "Error loading budget details." });
                }
            };
            fetchBudget();
        }
    }, [isUpdate, selectedId, form]);

    /**
     * Handle form submission to create or update a budget.
     * - Sends a POST request if creating a new budget.
     * - Sends a PUT request if updating an existing budget.
     */
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        setLoading(true);
        try {
            const method = isUpdate ? "PUT" : "POST";
            const url = isUpdate ? `/api/budget/${selectedId}` : `/api/budget`;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "Failed to save budget");
            }

            console.log("Budget saved successfully:", result);
            refreshData();
            handleCreateOrUpdate(false);
        } catch (error) {
            console.error("Error saving budget:", error);
            form.setError("name", { message: "Failed to save budget. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    /**
     * Render the budget form inside a dialog.
     * - Includes fields for name, total amount, project, and category.
     */
    return (
        <DialogHeader>
            <DialogTitle>{isUpdate ? "Update Budget" : "Create New Budget"}</DialogTitle>
            <DialogDescription>
                {isUpdate ? "Update the budget details." : "Fill out the form to create a new budget."}
            </DialogDescription>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Enter budget name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="totalamount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Total Amount (€)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Enter total amount"
                                        {...field}
                                        className="w-full"/>
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
                                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline"
                            onClick={() => {
                                form.reset();
                                handleCreateOrUpdate(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-primaryAccent hover:bg-primaryText text-white" disabled={loading}>
                            {loading ? "Saving..." : isUpdate ? "Update" : "Submit"}
                        </Button>
                    </div>
                </form>
            </Form>
        </DialogHeader>
    );
}
