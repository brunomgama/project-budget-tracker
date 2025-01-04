import { NextRequest, NextResponse } from 'next/server';
import { Category } from '@/types/interfaces/interface';
import sqlite3 from 'sqlite3';
import db from '../../../db/database';

// GET request to fetch all categories.
export async function GET() {
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
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

// DELETE request to delete categories by IDs.
export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const { ids } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'No IDs provided for deletion' }, { status: 400 });
        }

        const placeholders = ids.map(() => '?').join(', ');
        const sql = `DELETE FROM category WHERE id IN (${placeholders})`;

        const result = await new Promise<{ message: string; changes: number }>((resolve, reject) => {
            db.run(sql, ids, function (this: sqlite3.RunResult, err: { message: string }) {
                if (err) {
                    console.error('Delete Error:', err.message);
                    reject(err);
                } else {
                    resolve({ message: `${this.changes} category(s) deleted`, changes: this.changes });
                }
            });
        });

        // Return the number of deleted rows.
        if (result.changes === 0) {
            return NextResponse.json({ error: 'No categories found to delete' }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to delete categories' }, { status: 500 });
    }
}

// POST request to create a new category.
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name } = body;

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return NextResponse.json({ error: 'Invalid or missing category name' }, { status: 400 });
        }

        const sql = `INSERT INTO category (name) VALUES (?)`;

        const result = await new Promise<{ message: string; id: number }>((resolve, reject) => {
            db.run(sql, [name.trim()], function (this: sqlite3.RunResult, err: { message: string }) {
                if (err) {
                    console.error("Insert Error:", err.message);
                    reject(err);
                } else {
                    resolve({ message: "Category created successfully", id: this.lastID });
                }
            });
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
