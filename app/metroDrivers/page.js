'use client';

import { useState, useEffect } from 'react';
import Loading from '../../components/Loading';

export default function MetroDrivers() {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await fetch('/api/metroDrivers');
                if (!response.ok) {
                    throw new Error('Failed to fetch drivers');
                }
                const data = await response.json();
                setDrivers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDrivers();
    }, []);

    if (loading) return (
        <div className="container mx-auto px-4 py-8">
            <Loading />
        </div>
    );

    if (error) return (
        <div className="min-h-screen p-4">
            <div className="text-red-500">Error: {error}</div>
        </div>
    );

    return (
        <div className="min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Metro Towbook Drivers</h1>
            <div className="grid gap-4">
                {drivers.map((driver) => (
                    <div 
                        key={driver.id}
                        className="p-4 border rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                        <p className="font-medium">{driver.name}</p>
                        <p className="text-gray-500 text-sm">ID: {driver.id}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
