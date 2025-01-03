import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from "sqlite3";
const db = require('../../../../db/database');

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: "No ID provided" }, { status: 400 });
        }

        console.log(`Fetching expense for ID: ${id}`);

        const expense = await new Promise<any>((resolve, reject) => {
            db.get('SELECT * FROM expense WHERE id = ?', [id], (err: Error, row: any) => {
                if (err) {
                    console.error("Error fetching expense:", err);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (!expense) {
            return NextResponse.json({ error: "Expense not found" }, { status: 404 });
        }

        return NextResponse.json({ expense });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to fetch expense' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const body = await req.json();
        const { amount, description, date, budgetid } = body;

        if (!amount || !description || !date || !budgetid) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const sql = `UPDATE expense SET amount = ?, description = ?, date = ?, budgetid = ? WHERE id = ?`;

        const result = await new Promise<{ message: string; changes: number }>((resolve, reject) => {
            db.run(sql, [amount, description, date, budgetid, id], function (this: sqlite3.RunResult, err: { message: string }) {
                if (err) {
                    console.error("Update Error:", err.message);
                    reject(err);
                } else {
                    resolve({ message: "Expense updated successfully", changes: this.changes });
                }
            });
        });

        if (result.changes === 0) {
            return NextResponse.json({ error: "Expense not found or not updated" }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Failed to update expense" }, { status: 500 });
    }
}
