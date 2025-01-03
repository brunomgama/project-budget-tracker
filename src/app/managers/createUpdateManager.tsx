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
import {useEffect} from "react";

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
});

export default function CreateUpdateManager({selectedItems, handleCreateOrUpdate, refreshData}: {
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

            console.log("Manager saved successfully:", result);
            refreshData();
            handleCreateOrUpdate(false);
        } catch (error) {
            console.error("Error saving manager:", error);
        }
    };

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
