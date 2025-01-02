import { NextRequest, NextResponse } from 'next/server';
import { Project } from '@/types/interfaces/interface';
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
