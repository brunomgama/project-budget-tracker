import { NextRequest, NextResponse } from 'next/server';
import { Project } from '@/types/interfaces/interface';
import sqlite3 from 'sqlite3';
import db from '../../../db/database';

// GET request to fetch all projects.
export async function GET() {
    try {
        const projects = await new Promise<Project[]>((resolve, reject) => {
            db.all('SELECT * FROM project', [], (err: Error, rows: Project[]) => {
                if (err) {
                    console.error('Query Error:', err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        return NextResponse.json({ projects });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

// DELETE request to delete projects by IDs.
export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const { ids } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'No IDs provided for deletion' }, { status: 400 });
        }

        const placeholders = ids.map(() => '?').join(', ');
        const sql = `DELETE FROM project WHERE id IN (${placeholders})`;

        const result = await new Promise<{ message: string; changes: number }>((resolve, reject) => {
            db.run(sql, ids, function (this: sqlite3.RunResult, err: { message: string }) {
                if (err) {
                    console.error('Delete Error:', err.message);
                    reject(err);
                } else {
                    resolve({ message: `${this.changes} project(s) deleted`, changes: this.changes });
                }
            });
        });

        if (result.changes === 0) {
            return NextResponse.json({ error: 'No projects found to delete' }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}

// POST request to create a new project.
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, managerid } = body;

        console.log(name, managerid);

        if (!name || typeof name !== 'string' || name.trim() === '' || !managerid) {
            return NextResponse.json({ error: "Invalid or missing fields" }, { status: 400 });
        }

        // Check if a project with the same name already exists.
        const existingProject = await new Promise<Project | undefined>((resolve, reject) => {
            db.get('SELECT * FROM project WHERE name = ?', [name.trim()], (err: Error, row: Project | undefined) => {
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

        const sql = `INSERT INTO project (name, managerid) VALUES (?, ?)`;

        const result = await new Promise<{ message: string; id: number }>((resolve, reject) => {
            db.run(sql, [name.trim(), managerid], function (this: sqlite3.RunResult, err: { message: string }) {
                if (err) {
                    console.error("Insert Error:", err.message);
                    reject(err);
                } else {
                    resolve({ message: "Project created successfully", id: this.lastID });
                }
            });
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
}
