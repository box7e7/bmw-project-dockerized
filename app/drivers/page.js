'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import DriverForm from '../../components/DriverForm';
import './drivers.css';

export default function DriversPage() {
    const { user, error: userError, isLoading } = useUser();
    const [drivers, setDrivers] = useState([]);
    const [error, setError] = useState('');
    const [editingDriver, setEditingDriver] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch drivers
    const fetchDrivers = async () => {
        try {
            const response = await fetch('/api/drivers');
            if (!response.ok) throw new Error('Failed to fetch drivers');
            const data = await response.json();
            setDrivers(data);
        } catch (err) {
            setError('Error loading drivers');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    const handleSubmit = async (formData) => {
        try {
            const method = formData.id ? 'PUT' : 'POST';
            const response = await fetch('/api/drivers', {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save driver');
            }

            await fetchDrivers();
            setEditingDriver(null);
        } catch (err) {
            throw new Error(err.message || 'Error saving driver');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this driver?')) return;

        try {
            const response = await fetch(`/api/drivers?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete driver');
            }

            await fetchDrivers();
        } catch (err) {
            setError('Error deleting driver');
            console.error('Error:', err);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (userError) return <div>Error: {userError.message}</div>;
    if (!user) return <div>Please log in to access this page.</div>;

    return (
        <div style={{ minWidth: '1200px' }}>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-8">Driver Management</h1>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {editingDriver ? (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Edit Driver</h2>
                        <DriverForm 
                            initialData={editingDriver}
                            onSubmit={handleSubmit}
                            onCancel={() => setEditingDriver(null)}
                        />
                    </div>
                ) : (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Add New Driver</h2>
                        <DriverForm onSubmit={handleSubmit} />
                    </div>
                )}

                {/* Table */}
                <table className="min-w-full divide-y divide-gray-200 bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="w-[30%] md:w-[35%] px-6 py-3 text-left text-xs md:text-base font-medium text-gray-500 uppercase tracking-wider">UID</th>
                            <th scope="col" className="w-[25%] md:w-[30%] px-6 py-3 text-left text-xs md:text-base font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="w-[20%] md:w-[15%] px-2 py-3 text-left text-xs md:text-base font-medium text-gray-500 uppercase tracking-wider">Towbook ID</th>
                            <th scope="col" className="w-[25%] md:w-[20%] px-2 py-3 text-center text-xs md:text-base font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-xs md:text-base">Loading drivers...</td>
                            </tr>
                        ) : drivers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-xs md:text-base">No drivers found</td>
                            </tr>
                        ) : (
                            drivers.map((driver) => (
                                <tr key={driver.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs md:text-base">{driver.uid || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs md:text-base truncate max-w-[80px] md:max-w-[150px]">{driver.driver_name}</td>
                                    <td className="px-2 py-4 whitespace-nowrap text-xs md:text-base text-center">{driver.driver_id_towbook}</td>
                                    <td className="px-2 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button
                                                onClick={() => setEditingDriver(driver)}
                                                className="inline-flex items-center px-2 py-1 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-md text-xs md:text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5865F2]"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                <span className="ml-1">Edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(driver.id)}
                                                className="inline-flex items-center px-2 py-1 bg-[#ED4245] hover:bg-[#C03537] text-white rounded-md text-xs md:text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED4245]"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                <span className="ml-1 hidden md:inline">Delete</span>
                                                <span className="ml-1 md:hidden">Del</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
