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

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const { ids } = body;

        if (!ids || ids.length === 0) {
            return NextResponse.json({ error: 'No IDs provided for deletion' }, { status: 400 });
        }

        const placeholders = ids.map(() => '?').join(', ');
        const sql = `DELETE FROM category WHERE id IN (${placeholders})`;

        const result = await new Promise((resolve, reject) => {
            db.run(sql, ids, function (err) {
                if (err) {
                    console.error('Delete Error:', err.message);
                    reject(err);
                } else {
                    resolve({ message: `${this.changes} category deleted`, changes: this.changes });
                }
            });
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to delete categories' }, { status: 500 });
    }
}