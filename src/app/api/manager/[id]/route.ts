import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
const db = require('../../../../db/database');

// GET request to fetch manager details by ID.
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
        }

        const manager = await new Promise<any>((resolve, reject) => {
            db.get('SELECT * FROM manager WHERE id = ?', [id], (err: Error, row: any) => {
                if (err) {
                    console.error("Error fetching manager:", err);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (!manager) {
            return NextResponse.json({ error: "Manager not found" }, { status: 404 });
        }

        return NextResponse.json({ manager });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to fetch manager' }, { status: 500 });
    }
}

// PUT request to update a manager's details by ID.
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const body = await req.json();
        const { name } = body;

        // Validate required fields.
        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
        }
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return NextResponse.json({ error: "Invalid or missing manager name" }, { status: 400 });
        }

        const sql = `UPDATE manager SET name = ? WHERE id = ?`;

        const result = await new Promise<{ message: string; changes: number }>((resolve, reject) => {
            db.run(sql, [name.trim(), id], function (this: sqlite3.RunResult, err: { message: string }) {
                if (err) {
                    console.error("Update Error:", err.message);
                    reject(err);
                } else {
                    resolve({ message: "Manager updated successfully", changes: this.changes });
                }
            });
        });

        if (result.changes === 0) {
            return NextResponse.json({ error: "Manager not found or not updated" }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Failed to update manager" }, { status: 500 });
    }
}
