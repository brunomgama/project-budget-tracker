import { NextRequest, NextResponse } from 'next/server';
import { Manager } from '@/types/interfaces/interface';
import sqlite3 from 'sqlite3';
import db from '../../../db/database';

// GET request to fetch all managers.
export async function GET() {
    try {
        const managers = await new Promise<Manager[]>((resolve, reject) => {
            db.all('SELECT * FROM manager', [], (err: Error, rows: Manager[]) => {
                if (err) {
                    console.error('Query Error:', err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        return NextResponse.json({ managers });  // Return list of managers.
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch managers' }, { status: 500 });
    }
}

// DELETE request to delete managers by IDs.
export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const { ids } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'No IDs provided for deletion' }, { status: 400 });
        }

        const placeholders = ids.map(() => '?').join(', ');
        const sql = `DELETE FROM manager WHERE id IN (${placeholders})`;

        const result = await new Promise<{ message: string; changes: number }>((resolve, reject) => {
            db.run(sql, ids, function (this: sqlite3.RunResult, err: { message: string }) {
                if (err) {
                    console.error('Delete Error:', err.message);
                    reject(err);
                } else {
                    resolve({ message: `${this.changes} manager(s) deleted`, changes: this.changes });
                }
            });
        });

        if (result.changes === 0) {
            return NextResponse.json({ error: 'No managers found to delete' }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to delete managers' }, { status: 500 });
    }
}

// POST request to create a new manager.
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name } = body;

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return NextResponse.json({ error: "Invalid or missing manager name" }, { status: 400 });
        }

        const sql = `INSERT INTO manager (name) VALUES (?)`;

        const result = await new Promise<{ message: string; id: number }>((resolve, reject) => {
            db.run(sql, [name.trim()], function (this: sqlite3.RunResult, err: { message: string }) {
                if (err) {
                    console.error("Insert Error:", err.message);
                    reject(err);
                } else {
                    resolve({ message: "Manager created successfully", id: this.lastID });
                }
            });
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Failed to create manager" }, { status: 500 });
    }
}
