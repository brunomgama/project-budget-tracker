import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import db from '../../../../db/database';

// GET request to fetch project details by ID.
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
        }

        // Query to fetch the project by ID.
        const project = await new Promise<any>((resolve, reject) => {
            db.get('SELECT * FROM project WHERE id = ?', [id], (err: Error, row: any) => {
                if (err) {
                    console.error("Error fetching project:", err);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({ project });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

// PUT request to update a project's details by ID.
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const body = await req.json();
        const { name } = body;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
        }
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return NextResponse.json({ error: "Invalid or missing project name" }, { status: 400 });
        }

        // Check if a project with the same name already exists (excluding the current project).
        const existingProject = await new Promise<any>((resolve, reject) => {
            db.get('SELECT * FROM project WHERE name = ? AND id != ?', [name, id], (err: Error, row: any) => {
                if (err) {
                    console.error("Check Error:", err.message);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (existingProject) {
            return NextResponse.json({ error: "A project with this name already exists" }, { status: 400 });
        }

        const sql = `UPDATE project SET name = ? WHERE id = ?`;

        const result = await new Promise<{ message: string; changes: number }>((resolve, reject) => {
            db.run(sql, [name.trim(), id], function (this: sqlite3.RunResult, err: { message: string }) {
                if (err) {
                    console.error("Update Error:", err.message);
                    reject(err);
                } else {
                    resolve({ message: "Project updated successfully", changes: this.changes });
                }
            });
        });

        if (result.changes === 0) {
            return NextResponse.json({ error: "Project not found or not updated" }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
    }
}
