"use client";

/**
 * Import necessary components and hooks.
 * - `DialogHeader`, `DialogTitle`, and `DialogDescription` for form dialog structure.
 * - Form components for input handling and validation.
 * - `useForm` from `react-hook-form` for managing form state and submission.
 * - `useEffect` for side effects to fetch project details when updating.
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
 * - Requires the project name to be a non-empty string.
 */
const FormSchema = z.object({
    name: z.string().nonempty("Project name is required"),
});

/**
 * Main component for creating or updating a project.
 * - Props:
 *   - `selectedItems`: Set of selected project IDs for updates.
 *   - `handleCreateOrUpdate`: Function to close the form dialog.
 *   - `refreshData`: Function to refresh the project list after changes.
 */
export default function CreateUpdateProject({ selectedItems, handleCreateOrUpdate, refreshData }: {
    selectedItems: Set<number>;
    handleCreateOrUpdate: (value: boolean) => void;
    refreshData: () => void;
}) {
    // Check if this is an update operation and get the selected project ID.
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
     * Fetch project details for update operations.
     * - Pre-fills the form with existing project data if an ID is selected.
     */
    useEffect(() => {
        if (isUpdate && selectedId) {
            const fetchProject = async () => {
                try {
                    const res = await fetch(`/api/project/${selectedId}`);
                    const data = await res.json();

                    if (res.ok && data.project) {
                        form.reset({ name: data.project.name });
                    } else {
                        console.error("Failed to fetch project details");
                    }
                } catch (error) {
                    console.error("Error fetching project:", error);
                }
            };
            fetchProject();
        }
    }, [isUpdate, selectedId, form]);

    /**
     * Handle form submission for creating or updating a project.
     * - Sends a POST request for creating a new project.
     * - Sends a PUT request for updating an existing project.
     */
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            const method = isUpdate ? "PUT" : "POST";
            const url = isUpdate ? `/api/project/${selectedId}` : `/api/project`;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: data.name }),
            });

            const result = await res.json();

            if (!res.ok) {
                alert(result.error);
                throw new Error(result.error || "Failed to save project");
            }

            refreshData();
            handleCreateOrUpdate(false);
        } catch (error) {
            console.error("Error saving project:", error);
        }
    };

    /**
     * Render the form inside a dialog.
     * - Includes a single field for entering the project's name.
     * - Provides "Cancel" and "Submit/Update" buttons.
     */
    return (
        <DialogHeader>
            <DialogTitle>{isUpdate ? "Update Project" : "Create New Project"}</DialogTitle>
            <DialogDescription>
                {isUpdate ? "Update the project details." : "Fill out the form to create a new project."}
            </DialogDescription>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Project Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter project name" {...field} />
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
