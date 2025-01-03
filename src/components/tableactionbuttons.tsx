import {Button} from "@/components/ui/button";
import {TbPlus, TbTrash} from "react-icons/tb";

export default function TableActionButtons() {
    return (
        <div className="flex space-x-2 justify-end w-full">
            <Button variant="outline">
                <TbPlus/>
            </Button>
            <Button variant="destructive">
                <TbTrash/>
            </Button>
        </div>
    )
}