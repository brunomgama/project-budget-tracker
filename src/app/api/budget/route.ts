import { NextRequest, NextResponse } from 'next/server';
import {Budget} from '@/types/interfaces/interface';
const db = require('../../../db/database');

export async function GET(req: NextRequest) {
    try {
        const budgets = await new Promise<Budget[]>((resolve, reject) => {
            db.all('SELECT * FROM budget', [], (err: Error, rows: Budget[]) => {
                if (err) {
                    console.error('Query Error:', err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        return NextResponse.json({ budgets });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
    }
}
