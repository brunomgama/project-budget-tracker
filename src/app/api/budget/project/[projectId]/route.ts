import { NextResponse } from 'next/server';
const db = require('../../../../../db/database');

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
    try {
        const { projectId } = params;

        if (!projectId) {
            return NextResponse.json({ error: "No Project ID provided" }, { status: 400 });
        }

        const budgets = await new Promise<any[]>((resolve, reject) => {
            db.all('SELECT * FROM budget WHERE projectid = ?', [projectId], (err: Error, rows: any[]) => {
                if (err) {
                    console.error("Error fetching budgets:", err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        return NextResponse.json({ budgets });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
    }
}
