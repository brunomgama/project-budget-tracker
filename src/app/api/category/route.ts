import { NextRequest, NextResponse } from 'next/server';
import {Category} from '@/types/interfaces/interface';
const db = require('../../../db/database');

export async function GET(req: NextRequest) {
    try {
        const categories = await new Promise<Category[]>((resolve, reject) => {
            db.all('SELECT * FROM category', [], (err: Error, rows: Category[]) => {
                if (err) {
                    console.error('Query Error:', err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        return NextResponse.json({ categories });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
    }
}
