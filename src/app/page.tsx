import TabSelection from "@/components/tabSelection";

export default function HomePage() {
    return (
        <div>
            <h1 className="text-left text-3xl font-bold" style={{ color: "var(--color-darker)" }}>
                Dashboard
            </h1>

            <TabSelection />
        </div>
    );
}
