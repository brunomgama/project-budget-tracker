import { NextRequest, NextResponse } from 'next/server';
const db = require('../../../../db/database');

// GET request to fetch expenses for specific budget IDs.
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const budgetIds = searchParams.get('ids');

    if (!budgetIds) {
        return NextResponse.json({ error: "No budget IDs provided" }, { status: 400 });
    }

    const ids = budgetIds.split(',').map((id) => {
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId)) {
            return null;
        }
        return parsedId;
    }).filter((id) => id !== null);  // Remove any invalid IDs.

    if (ids.length === 0) {
        return NextResponse.json({ error: "No valid budget IDs provided" }, { status: 400 });
    }

    try {
        const expenses = await new Promise<any[]>((resolve, reject) => {
            const placeholders = ids.map(() => '?').join(', ');
            const sql = `SELECT * FROM expense WHERE budgetid IN (${placeholders})`;

            db.all(sql, ids, (err: Error, rows: any[]) => {
                if (err) {
                    console.error("Error fetching expenses:", err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        return NextResponse.json({ expenses });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
    }
}
