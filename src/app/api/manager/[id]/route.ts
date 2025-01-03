import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from "sqlite3";
const db = require('../../../../db/database');

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: "No ID provided" }, { status: 400 });
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const body = await req.json();
        const { name } = body;

        const sql = `UPDATE manager SET name = ? WHERE id = ?`;

        const result = await new Promise<{ message: string; changes: number }>((resolve, reject) => {
            db.run(sql, [name, id], function (this: sqlite3.RunResult, err: { message: string }) {
                if (err) {
                    console.error("Update Error:", err.message);
                    reject(err);
                } else {
                    resolve({ message: "Manager updated successfully", changes: this.changes });
                }
            });
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Failed to update manager" }, { status: 500 });
    }
}

