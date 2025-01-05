import { NextResponse } from 'next/server';
import db from '../../../../../db/database';
import {Budget} from "@/types/interfaces/interface";

// GET request to fetch all budgets associated with a specific project ID.
export async function GET(request: Request, { params }: { params: Promise<{ projectId: string }> }) {
    try {
        const projectId = (await params).projectId

        if (!projectId || isNaN(Number(projectId))) {
            return NextResponse.json({ error: "Invalid Project ID" }, { status: 400 });
        }

        // Fetch all budgets for the given projectId.
        const budgets = await new Promise<Budget[] | undefined>((resolve, reject) => {
            db.all('SELECT * FROM budget WHERE projectid = ?', [projectId], (err: Error, rows: Budget[] | undefined) => {
                if (err) {
                    console.error("Error fetching budgets:", err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        // Return budgets or an empty list if no budgets exist.
        return NextResponse.json({ budgets });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
    }
}
