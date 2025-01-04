import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import db from '../../../../db/database';
import {Expense} from "@/types/interfaces/interface";

// GET request to fetch expense details by ID.
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
        }

        const expense = await new Promise<Expense | undefined>((resolve, reject) => {
            db.get('SELECT * FROM expense WHERE id = ?', [id], (err: Error, row: Expense | undefined) => {
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

// PUT request to update an expense by ID.
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const body = await req.json();
        const { amount, description, date, budgetid, categoryid } = body;

        // Validate that the required fields are provided.
        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
        }
        if (amount === undefined || typeof amount !== 'number' || amount <= 0) {
            return NextResponse.json({ error: "Invalid or missing amount" }, { status: 400 });
        }
        if (!description || typeof description !== 'string') {
            return NextResponse.json({ error: "Invalid or missing description" }, { status: 400 });
        }
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return NextResponse.json({ error: "Invalid or missing date (expected format YYYY-MM-DD)" }, { status: 400 });
        }
        if (!budgetid || isNaN(Number(budgetid))) {
            return NextResponse.json({ error: "Invalid or missing budget ID" }, { status: 400 });
        }
        if (!categoryid || isNaN(Number(categoryid))) {
            return NextResponse.json({ error: "Invalid or missing category ID" }, { status: 400 });
        }

        const sql = `UPDATE expense SET amount = ?, description = ?, date = ?, budgetid = ?, categoryid = ? WHERE id = ?`;

        const result = await new Promise<{ message: string; changes: number }>((resolve, reject) => {
            db.run(sql, [amount, description, date, budgetid, categoryid, id], function (this: sqlite3.RunResult, err: { message: string }) {
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
