import {Button} from "@/components/ui/button";
import {
    TbPlus,
    TbTrash,
} from "react-icons/tb";
import {usePathname} from "next/navigation";

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

    return (
        <div className="flex space-x-2 justify-end w-full">
            <Button variant="outline">
                <TbPlus/>
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
                <TbTrash/>
            </Button>
        </div>
    )
}