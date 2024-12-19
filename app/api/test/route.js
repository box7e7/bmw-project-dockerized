import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { jwtDecode } from "jwt-decode";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// A function to format dates consistently
const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: 'numeric', 
        minute: '2-digit', 
        second: 'numeric',
        hour12: true,
    }).format(new Date(date));
};

// A function to fetch BMW records from the database
const fetchBMWRecords = async () => {
    // Define date range
    const today = new Date();
    const endDate = today;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 60); // Go back 60 days

    try {
        const bmwRecords = await prisma.bmw.findMany({
            where: {
                createdAT: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        // Debugging to see if records are fetched
        console.log("Fetched BMW Records:", bmwRecords);

        return bmwRecords
            .filter(record => !record.PdfCreatedAt) // Only records without PdfCreatedAt
            .map(record => ({
                ...record,
                createdAT: formatDate(record.createdAT), // Format the createdAt date
            }));
    } catch (error) {
        console.error("Error fetching data from Prisma:", error);
        throw new Error("Failed to fetch BMW records."); // Provide a clear error message
    }
};

// Main handler function for GET requests
export const GET = withApiAuthRequired(async (req) => {
    try {
        const res = new NextResponse();
        const { accessToken } = await getAccessToken(req, res);

        const decoded = jwtDecode(accessToken);
        console.log("Decoded permissions:", decoded.permissions);

        const records = await fetchBMWRecords();

        // Check if user has permission to read the database
        if (decoded.permissions.includes('read:dbs')) {
            return NextResponse.json(records, res);
        }

        // If not authorized, return 403
        return NextResponse.json({ error: "Not Authorized" }, { status: 403 });
    } catch (error) {
        console.error("Error in GET handler:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
});