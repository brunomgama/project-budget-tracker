import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import db from '../../../../db/database';
import {Budget} from "@/types/interfaces/interface";

// GET request to fetch budget details by ID.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id

        if (!id) {
            return NextResponse.json({ error: "No ID provided" }, { status: 400 });
        }

        // Fetch the budget by ID from the database.
        const budget = await new Promise<Budget | undefined>((resolve, reject) => {
            db.get('SELECT * FROM budget WHERE id = ?', [id], (err: Error, row: Budget | undefined) => {
                if (err) {
                    console.error("Error fetching budget:", err);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (!budget) {
            return NextResponse.json({ error: "Budget not found" }, { status: 404 });
        }

        return NextResponse.json({ budget });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to fetch budget' }, { status: 500 });
    }
}

// PUT request to update a budget by ID.
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id
        const body = await req.json();
        const { name, totalamount, projectid, categoryid } = body;

        if (!name || totalamount === undefined || !projectid || !categoryid) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const sql = `UPDATE budget SET name = ?, totalamount = ?, projectid = ?, categoryid = ? WHERE id = ?`;

        // Execute the update query.
        const result = await new Promise<{ message: string; changes: number }>((resolve, reject) => {
            db.run(sql, [name, totalamount, projectid, categoryid, id], function (this: sqlite3.RunResult, err: { message: string }) {
                if (err) {
                    console.error("Update Error:", err.message);
                    reject(err);
                } else {
                    resolve({ message: "Budget updated successfully", changes: this.changes });
                }
            });
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Failed to update budget" }, { status: 500 });
    }
}
