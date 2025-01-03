import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from "sqlite3";
const db = require('../../../../db/database');

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: "No ID provided" }, { status: 400 });
        }

        const budget = await new Promise<any>((resolve, reject) => {
            db.get('SELECT * FROM budget WHERE id = ?', [id], (err: Error, row: any) => {
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const body = await req.json();
        const { name, totalamount, projectid } = body;

        if (!name || totalamount === undefined || !projectid) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const sql = `UPDATE budget SET name = ?, totalamount = ?, projectid = ? WHERE id = ?`;

        const result = await new Promise<{ message: string; changes: number }>((resolve, reject) => {
            db.run(sql, [name, totalamount, projectid, id], function (this: sqlite3.RunResult, err: { message: string }) {
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
