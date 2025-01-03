import {Card, CardHeader, CardTitle} from "@/components/ui/card";

export default function InfoCard({ title, value }: { title: string; value: string }) {
    return (
        <Card className="flex-1 min-w-[300px]">
            <CardHeader className="flex">
                <CardTitle className="text-lg font-medium">{title}</CardTitle>
                <p className="text-2xl font-bold">{value}</p>
            </CardHeader>
        </Card>
    )
}