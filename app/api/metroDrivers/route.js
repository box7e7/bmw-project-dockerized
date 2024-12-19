const { NextResponse } = require('next/server');
const { getDriversFull } = require('../../../scripts/getDriversFull_metro.js');

export async function GET() {
    try {
        console.log('Current working directory:', process.cwd());
        console.log('Attempting to fetch drivers using getDriversFull function');
        
        const data = await getDriversFull();
        console.log('Raw response data:', data);

        if (!data || data.error) {
            console.error('Error in data:', data.error);
            return NextResponse.json(
                { error: 'Failed to fetch drivers', details: data.error },
                { status: 500 }
            );
        }

        // Extract only id and name from each driver
        const simplifiedDrivers = data.map(driver => ({
            id: driver.id,
            name: driver.name
        }));

        console.log('Simplified drivers:', simplifiedDrivers);
        return NextResponse.json(simplifiedDrivers);
    } catch (error) {
        console.error("Error fetching drivers:", error);
        console.error("Error details:", {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        return NextResponse.json(
            { error: 'Failed to fetch drivers', details: error.message },
            { status: 500 }
        );
    }
}
