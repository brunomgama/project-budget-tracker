import { NextResponse } from 'next/server';
import db from '../../../../../db/database';
import {Manager} from "@/types/interfaces/interface";

export async function GET(request: Request, { params }: { params: Promise<{ managerId: string }> }) {
    const managerId = (await params).managerId

    if (!managerId || isNaN(Number(managerId))) {
        return NextResponse.json({ error: "Invalid or missing Manager ID" }, { status: 400 });
    }

    try {
        const manager = await new Promise<Manager | undefined>((resolve, reject) => {
            db.get('SELECT id, name FROM managers WHERE id = ?', [managerId], (err: Error | null, row?: Manager) => {
                if (err) {
                    console.error("Error fetching manager:", err);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (!manager) {
            return NextResponse.json({ error: "Manager not found" }, { status: 404 });
        }

        return NextResponse.json({ manager });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to fetch manager' }, { status: 500 });
    }
}
