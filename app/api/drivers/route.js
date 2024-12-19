import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Initialize database connection
async function getDb() {
    return open({
        filename: path.join(process.cwd(), 'scripts/drivers.db'),
        driver: sqlite3.Database
    });
}

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const db = await getDb();
        const drivers = await db.all('SELECT * FROM drivers ORDER BY driver_name');
        await db.close();

        return NextResponse.json(drivers);
    } catch (error) {
        console.error('Error fetching drivers:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const data = await request.json();
        const { uid, driver_name, driver_id_towbook } = data;

        if (!driver_name || !driver_id_towbook) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = await getDb();
        const result = await db.run(
            'INSERT INTO drivers (uid, driver_name, driver_id_towbook) VALUES (?, ?, ?)',
            [uid || null, driver_name, driver_id_towbook]
        );
        await db.close();

        return NextResponse.json({ 
            message: 'Driver added successfully',
            id: result.lastID 
        });
    } catch (error) {
        console.error('Error adding driver:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const data = await request.json();
        const { id, uid, driver_name, driver_id_towbook } = data;

        if (!id || !driver_name || !driver_id_towbook) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = await getDb();
        const result = await db.run(
            'UPDATE drivers SET uid = ?, driver_name = ?, driver_id_towbook = ? WHERE id = ?',
            [uid || null, driver_name, driver_id_towbook, id]
        );
        await db.close();

        if (result.changes === 0) {
            return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Driver updated successfully' });
    } catch (error) {
        console.error('Error updating driver:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing driver ID' }, { status: 400 });
        }

        const db = await getDb();
        const result = await db.run('DELETE FROM drivers WHERE id = ?', [id]);
        await db.close();

        if (result.changes === 0) {
            return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Driver deleted successfully' });
    } catch (error) {
        console.error('Error deleting driver:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
