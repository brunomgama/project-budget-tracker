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
import {Input} from "@/components/ui/input";

const FormSchema = z.object({
    name: z.string().nonempty("Name is required"),
});

export default function CreateUpdateCategory({ selectedItems, handleCreateOrUpdate, refreshData }: {
    selectedItems: Set<number>;
    handleCreateOrUpdate: (value: boolean) => void;
    refreshData: () => void;
}) {
    const isUpdate = selectedItems.size > 0;
    const selectedId = isUpdate ? Array.from(selectedItems)[0] : null;

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
        },
    });

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
                    }
                } catch (error) {
                    console.error("Error fetching category:", error);
                }
            };
            fetchCategory();
        }
    }, [isUpdate, selectedId, form]);

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
        }
    };

    return (
        <DialogHeader>
            <DialogTitle>{isUpdate ? "Update Category" : "Create New Category"}</DialogTitle>
            <DialogDescription>
                {isUpdate ? "Update the category details." : "Fill out the form to create a new category."}
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
                                        placeholder="Enter category name"
                                        {...field}
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
