"use client";

/**
 * Import necessary components and hooks.
 * - `DialogHeader`, `DialogTitle`, `DialogDescription` for the dialog layout.
 * - `Button` for form submission and cancel actions.
 * - `z` for schema validation using Zod.
 * - `useForm` for form handling.
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
import { useEffect } from "react";
import { Input } from "@/components/ui/input";

/**
 * Form validation schema using Zod.
 * - Ensures the "name" field is a non-empty string.
 */
const FormSchema = z.object({
    name: z.string().nonempty("Name is required"),
});

/**
 * Component for creating or updating a category.
 * Props:
 * - selectedItems: set of selected category IDs.
 * - handleCreateOrUpdate: function to close the dialog.
 * - refreshData: function to refresh the category list after an operation.
 */
export default function CreateUpdateCategory({
                                                 selectedItems,
                                                 handleCreateOrUpdate,
                                                 refreshData,
                                             }: {
    selectedItems: Set<number>;
    handleCreateOrUpdate: (value: boolean) => void;
    refreshData: () => void;
}) {
    // Determine if this is an update operation and get the selected ID.
    const isUpdate = selectedItems.size > 0;
    const selectedId = isUpdate ? Array.from(selectedItems)[0] : null;

    // Initialize the form with default values and validation schema.
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
        },
    });

    /**
     * Fetch the category details if this is an update operation.
     * - Fetches the category data based on the selected ID.
     * - Populates the form with the existing category name.
     */
    useEffect(() => {
        if (isUpdate && selectedId) {
            const fetchCategory = async () => {
                try {
                    const res = await fetch(`/api/category/${selectedId}`);
                    if (!res.ok) {
                        throw new Error(`Failed to fetch category: ${res.statusText}`);
                    }
                    const data = await res.json();

                    if (data.category) {
                        form.reset({
                            name: data.category.name,
                        });
                    } else {
                        console.error("Category not found");
                        form.setError("name", { message: "Category not found." });
                    }
                } catch (error) {
                    console.error("Error fetching category:", error);
                    form.setError("name", { message: "Error loading category details." });
                }
            };
            fetchCategory();
        }
    }, [isUpdate, selectedId, form]);

    /**
     * Handle form submission for creating or updating a category.
     * - Sends a POST request for creating a new category.
     * - Sends a PUT request for updating an existing category.
     */
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            const method = isUpdate ? "PUT" : "POST";
            const url = isUpdate ? `/api/category/${selectedId}` : `/api/category`;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "Failed to save category");
            }

            console.log("Category saved successfully:", result);
            refreshData();
            handleCreateOrUpdate(false);
        } catch (error) {
            console.error("Error saving category:", error);
            form.setError("name", { message: "Failed to save category. Please try again." });
        }
    };

    /**
     * Render the category form inside a dialog.
     * - Includes a single field for the category name.
     * - Shows "Update" or "Submit" based on whether it's an update or create operation.
     */
    return (
        <DialogHeader>
            <DialogTitle>{isUpdate ? "Update Category" : "Create New Category"}</DialogTitle>
            <DialogDescription>
                {isUpdate ? "Update the category details." : "Fill out the form to create a new category."}
            </DialogDescription>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4">
                    {/* Category Name Field */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Enter category name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                form.reset();
                                handleCreateOrUpdate(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-primaryAccent hover:bg-primaryText text-white"
                        >
                            {isUpdate ? "Update" : "Submit"}
                        </Button>
                    </div>
                </form>
            </Form>
        </DialogHeader>
    );
}
