import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {useRouter} from "next/navigation";

export default function InfoCard({ title, value, icon, href }: { title: string; value: string, icon: any, href: string }) {
    const router = useRouter();

    const handleClick = () => {
        router.push(href);
    };

    return (
        <Card onClick={handleClick} className="flex-1 min-w-[300px] bg-indigo-100 hover:bg-indigo-200 transition">
            <CardHeader className="flex justify-between">
                <div className="flex justify-between gap-2">
                    <CardTitle className="text-lg font-medium">{title}</CardTitle>
                    {icon && <div className="text-indigo-700 text-3xl">{icon}</div>}
                </div>
                    <p className="text-2xl font-bold">{value}</p>
            </CardHeader>
        </Card>
    )
}