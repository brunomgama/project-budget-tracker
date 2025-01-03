import { NextRequest, NextResponse } from 'next/server';
import { Project } from '@/types/interfaces/interface';
import sqlite3 from "sqlite3";
const db = require('../../../db/database');

export async function GET(req: NextRequest) {
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

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const { ids } = body;

        if (!ids || ids.length === 0) {
            return NextResponse.json({ error: 'No ID provided for deletion' }, { status: 400 });
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
                }
            );
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name } = body;

        const sql = `INSERT INTO project (name) VALUES (?)`;

        const result = await new Promise((resolve, reject) => {
            db.run(sql, [name], function (this: sqlite3.RunResult, err: { message: any; }) {
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
