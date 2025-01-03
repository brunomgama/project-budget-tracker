"use client"

import {Button} from "@/components/ui/button";
import {
    TbPlus,
    TbTrash,
} from "react-icons/tb";
import {usePathname} from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog";
import {useState} from "react";
import CreateUpdateProject from "@/app/projects/createUpdateProject";
import CreateUpdateManager from "@/app/managers/createUpdateManager";
import CreateUpdateExpense from "@/app/expenses/createUpdateExpense";
import CreateUpdateCategory from "@/app/categories/createUpdateCategory";
import CreateUpdateBudget from "@/app/budgets/createUpdateBudget";

const routingTable = [
    { folder: "project", path: "/projects" },
    { folder: "manager", path: "/managers" },
    { folder: "expense", path: "/expenses" },
    { folder: "category", path: "/categories" },
    { folder: "budget", path: "/budgets" },
];

export default function TableActionButtons({selectedItems, refreshData}: {selectedItems: Set<number>; refreshData: () => void;}) {
    const pathname = usePathname()
    const apipathname = routingTable.find((route) => route.path === pathname)?.folder;

    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDelete = async () => {
        const res = await fetch(`/api/${apipathname}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ids: Array.from(selectedItems)}),

        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Failed to delete projects");
        }
        refreshData();
    }

    const handleCreateOrUpdate = (value: boolean) => {
        setDialogOpen(value)
    }

    return (
        <div className="flex space-x-2 justify-end w-full">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => handleCreateOrUpdate(true)}>
                        <TbPlus/>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    {pathname === '/managers' && (
                        <CreateUpdateManager selectedItems={selectedItems} handleCreateOrUpdate={handleCreateOrUpdate} refreshData={refreshData}/>
                    )}
                    {pathname === '/expenses' && (
                        <CreateUpdateExpense selectedItems={selectedItems} handleCreateOrUpdate={handleCreateOrUpdate} refreshData={refreshData}/>
                    )}
                    {pathname === '/budgets' && (
                        <CreateUpdateBudget selectedItems={selectedItems} handleCreateOrUpdate={handleCreateOrUpdate} refreshData={refreshData}/>
                    )}
                    {pathname === '/categories' && (
                        <CreateUpdateCategory selectedItems={selectedItems} handleCreateOrUpdate={handleCreateOrUpdate} refreshData={refreshData}/>
                    )}
                    {pathname === '/projects' && (
                        <CreateUpdateProject selectedItems={selectedItems} handleCreateOrUpdate={handleCreateOrUpdate} refreshData={refreshData}/>
                    )}
                </DialogContent>
            </Dialog>

            <Button variant="destructive" onClick={handleDelete}>
                <TbTrash/>
            </Button>
        </div>
    )
}