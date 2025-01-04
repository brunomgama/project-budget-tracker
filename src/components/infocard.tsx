/**
 * `InfoCard` component:
 * Displays a card with a title, value, and an icon.
 * - The card is clickable and navigates to a different route when clicked.
 * - Props:
 *   - `title`: Title text displayed at the top of the card.
 *   - `value`: The main numerical or informational value displayed prominently.
 *   - `icon`: An optional icon displayed next to the title.
 *   - `href`: The route to navigate when the card is clicked.
 */
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function InfoCard({
                                     title,
                                     value,
                                     icon,
                                     href,
                                 }: {
    title: string;
    value: string;
    icon: any;
    href: string;
}) {
    const router = useRouter();

    /**
     * `handleClick` function:
     * Triggered when the card is clicked.
     * Navigates to the specified `href` route.
     */
    const handleClick = () => {
        router.push(href);
    };

    return (
        /**
         * Main card container:
         * - `flex-1`: Ensures flexible width.
         * - `min-w-[300px]`: Sets a minimum width for consistent layout.
         * - `bg-indigo-100` and `hover:bg-indigo-200`: Background color with hover transition effect.
         */
        <Card
            onClick={handleClick}
            className="flex-1 min-w-[300px] bg-indigo-100 hover:bg-indigo-200 transition"
        >
            {/* Card Header: Contains the title, icon, and value */}
            <CardHeader className="flex justify-between">
                <div className="flex justify-between gap-2">
                    {/* Card Title */}
                    <CardTitle className="text-lg font-medium">{title}</CardTitle>
                    {/* Optional icon */}
                    {icon && <div className="text-indigo-700 text-3xl">{icon}</div>}
                </div>
                {/* Value displayed prominently */}
                <p className="text-2xl font-bold">{value}</p>
            </CardHeader>
        </Card>
    );
}
