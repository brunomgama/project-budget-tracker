"use client";

/**
 * Import necessary components and hooks.
 * - `DialogHeader`, `DialogTitle`, and `DialogDescription` for displaying the form dialog header.
 * - Form components for handling form inputs, validation, and submission.
 * - `useForm` from `react-hook-form` for form management.
 * - `useEffect` for side effects to handle fetching manager details during updates.
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
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

/**
 * Define form schema for validation using Zod.
 * - Requires the manager name to be a non-empty string.
 */
const FormSchema = z.object({
    name: z.string().nonempty("Manager name is required"),
});

/**
 * Main component for creating or updating a manager.
 * - Props:
 *   - `selectedItems`: Set of selected manager IDs for updates.
 *   - `handleCreateOrUpdate`: Function to close the form dialog.
 *   - `refreshData`: Function to refresh the manager list after changes.
 */
export default function CreateUpdateManager({ selectedItems, handleCreateOrUpdate, refreshData }: {
    selectedItems: Set<number>;
    handleCreateOrUpdate: (value: boolean) => void;
    refreshData: () => void;
}) {
    // Check if this is an update operation and get the selected manager ID.
    const isUpdate = selectedItems.size > 0;
    const selectedId = isUpdate ? Array.from(selectedItems)[0] : null;

    // Initialize form with default values and validation schema.
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
        },
    });

    /**
     * Fetch manager details for update operations.
     * - Pre-fills the form with existing manager data if an ID is selected.
     */
    useEffect(() => {
        if (isUpdate && selectedId) {
            const fetchManager = async () => {
                try {
                    const res = await fetch(`/api/manager/${selectedId}`);
                    const data = await res.json();

                    if (res.ok && data.manager) {
                        form.reset({ name: data.manager.name });
                    } else {
                        console.error("Failed to fetch manager details");
                    }
                } catch (error) {
                    console.error("Error fetching manager:", error);
                }
            };
            fetchManager();
        }
    }, [isUpdate, selectedId, form]);

    /**
     * Handle form submission for creating or updating a manager.
     * - Sends a POST request for creating a new manager.
     * - Sends a PUT request for updating an existing manager.
     */
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            const method = isUpdate ? "PUT" : "POST";
            const url = isUpdate ? `/api/manager/${selectedId}` : `/api/manager`;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: data.name }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "Failed to save manager");
            }

            refreshData();
            handleCreateOrUpdate(false);
        } catch (error) {
            console.error("Error saving manager:", error);
        }
    };

    /**
     * Render the form inside a dialog.
     * - Includes a single field for entering the manager's name.
     * - Provides "Cancel" and "Submit/Update" buttons.
     */
    return (
        <DialogHeader>
            <DialogTitle>{isUpdate ? "Update Manager" : "Create New Manager"}</DialogTitle>
            <DialogDescription>
                {isUpdate ? "Update the manager details." : "Fill out the form to create a new manager."}
            </DialogDescription>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Manager Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter manager name" {...field} />
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
