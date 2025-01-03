import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from "sqlite3";
const db = require('../../../../db/database');

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: "No ID provided" }, { status: 400 });
        }

        console.log(`Fetching category for ID: ${id}`);

        const category = await new Promise<any>((resolve, reject) => {
            db.get('SELECT * FROM category WHERE id = ?', [id], (err: Error, row: any) => {
                if (err) {
                    console.error("Error fetching category:", err);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json({ category });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const body = await req.json();
        const { name, projectid } = body;

        if (!name || !projectid) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const sql = `UPDATE category SET name = ?, projectid = ? WHERE id = ?`;

        const result = await new Promise<{ message: string; changes: number }>((resolve, reject) => {
            db.run(sql, [name, projectid, id], function (this: sqlite3.RunResult, err: { message: string }) {
                if (err) {
                    console.error("Update Error:", err.message);
                    reject(err);
                } else {
                    resolve({ message: "Category updated successfully", changes: this.changes });
                }
            });
        });

        if (result.changes === 0) {
            return NextResponse.json({ error: "Category not found or not updated" }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}
