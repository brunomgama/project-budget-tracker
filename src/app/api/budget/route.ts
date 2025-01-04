import { NextRequest, NextResponse } from 'next/server';
import { Budget } from '@/types/interfaces/interface';
import db from '../../../db/database';
import sqlite3 from 'sqlite3';

// GET request to fetch all budgets from the database.
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

// DELETE request to remove one or more budgets by their IDs.
export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const { ids } = body;

        // Validate that the 'ids' array is provided and contains at least one ID.
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'No IDs provided for deletion' }, { status: 400 });
        }

        const placeholders = ids.map(() => '?').join(', ');
        const sql = `DELETE FROM budget WHERE id IN (${placeholders})`;

        const result = await new Promise<{ message: string; changes: number }>((resolve, reject) => {
            db.run(sql, ids, function (this: sqlite3.RunResult, err: { message: string }) {
                if (err) {
                    console.error('Delete Error:', err.message);
                    reject(err);
                } else {
                    resolve({ message: `${this.changes} budget(s) deleted`, changes: this.changes });
                }
            });
        });

        // Return the number of deleted rows.
        return NextResponse.json(result);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to delete budgets' }, { status: 500 });
    }
}

// POST request to create a new budget.
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, totalamount, projectid, categoryid } = body;

        if (!name || totalamount === undefined || !projectid || !categoryid) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const sql = `INSERT INTO budget (name, totalamount, projectid, categoryid) VALUES (?, ?, ?, ?)`;

        const result = await new Promise<{ message: string; id: number }>((resolve, reject) => {
            db.run(sql, [name, totalamount, projectid, categoryid], function (this: sqlite3.RunResult, err: { message: string }) {
                if (err) {
                    console.error("Insert Error:", err.message);
                    reject(err);
                } else {
                    resolve({ message: "Budget created successfully", id: this.lastID });
                }
            });
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Failed to create budget" }, { status: 500 });
    }
}
