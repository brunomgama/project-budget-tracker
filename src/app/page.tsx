"use client";

import { useEffect, useState } from 'react';
import { APIResponse } from '@/types/interfaces/interface';

export default function HomePage() {
    const [data, setData] = useState<APIResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/project")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then((data) => setData(data))
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError(error.message);
            });
    }, []);

    if (error) {
        return (
            <p className="text-center text-sm font-medium" style={{ color: "var(--color-error)" }}>
                Error: {error}
            </p>
        );
    }

    if (!data) {
        return (
            <p className="text-center text-sm font-medium" style={{ color: "var(--color-secondaryText)" }}>
                Loading...
            </p>
        );
    }

    return (
        <div>
            <h1 className="text-left text-3xl font-bold m-6" style={{ color: "var(--color-darker)" }}>
                Project Budget Tracker
            </h1>

            <section>
                <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--color-dark)" }}>
                    Projects
                </h2>
                {data.projects.length === 0 ? (
                    <p style={{ color: "var(--color-secondaryText)" }}>
                        No projects found.
                    </p>
                ) : (
                    <ul className="list-disc pl-6" style={{color: "var(--color-darker)"}}>
                        {data.projects.map((project) => (
                            <li key={project.id} className="mb-2">
                                {project.name}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );

}
