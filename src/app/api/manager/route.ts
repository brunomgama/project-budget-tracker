import { NextRequest, NextResponse } from 'next/server';
import {Manager} from '@/types/interfaces/interface';
const db = require('../../../db/database');

export async function GET(req: NextRequest) {
    try {
        const managers = await new Promise<Manager[]>((resolve, reject) => {
            db.all('SELECT * FROM manager', [], (err: Error, rows: Manager[]) => {
                if (err) {
                    console.error('Query Error:', err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        return NextResponse.json({ managers });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch managers' }, { status: 500 });
    }
}
