"use client";

import { useEffect, useState } from 'react';
import { APIResponse } from '@/types/interfaces/interface';

export default function HomePage() {
    const [data, setData] = useState<APIResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/project')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then((data) => setData(data))
            .catch((error) => {
                console.error('Error fetching data:', error);
                setError(error.message);
            });
    }, []);

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!data) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Project Budget Tracker</h1>
            <section>
                <h2>Projects</h2>
                {data.projects.length === 0 ? (
                    <p>No projects found.</p>
                ) : (
                    <ul>
                        {data.projects.map((project) => (
                            <li key={project.id}>{project.name}</li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
