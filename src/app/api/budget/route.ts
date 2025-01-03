import { NextRequest, NextResponse } from 'next/server';
import { Budget } from '@/types/interfaces/interface';
const db = require('../../../db/database');
import sqlite3 from 'sqlite3';

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

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const { ids } = body;

        if (!ids || ids.length === 0) {
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
                }
            );
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to delete budgets' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, totalamount, projectid } = body;

        const sql = `INSERT INTO budget (name, totalamount, projectid) VALUES (?, ?, ?)`;

        const result = await new Promise((resolve, reject) => {
            db.run(sql, [name, totalamount, projectid], function (this: sqlite3.RunResult, err: { message: any; }) {
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
