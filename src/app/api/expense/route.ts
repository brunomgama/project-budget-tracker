import { NextRequest, NextResponse } from 'next/server';
import {Expense} from "@/types/interfaces/interface";
const db = require('../../../db/database');

export async function GET(req: NextRequest) {
    try {
        const expenses = await new Promise<Expense[]>((resolve, reject) => {
            db.all('SELECT * FROM expense', [], (err: Error, rows: Expense[]) => {
                if (err) {
                    console.error('Query Error:', err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        return NextResponse.json({ expenses });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
    }
}
