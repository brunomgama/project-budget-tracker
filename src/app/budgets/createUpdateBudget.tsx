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
import { useEffect, useState } from "react";
import {Project} from "@/types/interfaces/interface";
import {Input} from "@/components/ui/input";

const FormSchema = z.object({
    name: z.string().nonempty("Name is required"),
    totalamount: z.coerce.number().positive("Total amount must be a positive number"),
    projectid: z.coerce.number().positive("Project ID must be a positive number"),
});

export default function CreateUpdateBudget({ selectedItems, handleCreateOrUpdate, refreshData }: {
    selectedItems: Set<number>;
    handleCreateOrUpdate: (value: boolean) => void;
    refreshData: () => void;
}) {
    const isUpdate = selectedItems.size > 0;
    const selectedId = isUpdate ? Array.from(selectedItems)[0] : null;

    const [projects, setProjects] = useState<Project[]>([]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            totalamount: 0,
            projectid: 0,
        },
    });

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
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        if (isUpdate && selectedId) {
            const fetchBudget = async () => {
                try {
                    console.log(`Fetching budget for ID: ${selectedId}`);
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
                        });
                    } else {
                        console.error("Budget not found");
                    }
                } catch (error) {
                    console.error("Error fetching budget:", error);
                }
            };
            fetchBudget();
        }
    }, [isUpdate, selectedId, form]);

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
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
        }
    };

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
                                    <Input
                                        type="text"
                                        placeholder="Enter budget name"
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
                                <FormLabel>Total Amount</FormLabel>
                                <FormControl>
                                    <div className="flex items-center border border-gray-300 rounded-md p-2">
                                        <Input
                                            type="number"
                                            placeholder="Enter total amount"
                                            {...field}
                                            className={"w-full mr-2"}
                                        />
                                        <span className="mr-2 text-gray-500">€</span>
                                    </div>
                                </FormControl>
                                <FormMessage/>
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
