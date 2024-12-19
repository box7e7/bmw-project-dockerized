'use client';

import { useState, useEffect } from 'react';

export default function DriverForm({ onSubmit, initialData = null, onCancel = null }) {
    const [formData, setFormData] = useState({
        id: '',
        uid: '',
        driver_name: '',
        driver_id_towbook: '',
    });
    const [error, setError] = useState('');

    // Update form when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData({
                id: initialData.id,
                uid: initialData.uid || '',
                driver_name: initialData.driver_name || '',
                driver_id_towbook: initialData.driver_id_towbook || '',
            });
        } else {
            setFormData({
                id: '',
                uid: '',
                driver_name: '',
                driver_id_towbook: '',
            });
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.driver_name || !formData.driver_id_towbook) {
            setError('Driver name and Towbook ID are required');
            return;
        }

        try {
            await onSubmit(formData);
            if (!initialData) {
                // Only reset form if it's a new driver
                setFormData({
                    id: '',
                    uid: '',
                    driver_name: '',
                    driver_id_towbook: '',
                });
            }
        } catch (err) {
            setError(err.message || 'Error saving driver');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
            {error && (
                <div className="text-red-500 text-sm mb-4">
                    {error}
                </div>
            )}
            
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    UID (Optional)
                </label>
                <input
                    type="text"
                    name="uid"
                    value={formData.uid}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Driver Name *
                </label>
                <input
                    type="text"
                    name="driver_name"
                    value={formData.driver_name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Towbook ID *
                </label>
                <input
                    type="number"
                    name="driver_id_towbook"
                    value={formData.driver_id_towbook}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div className="flex space-x-4">
                <button
                    type="submit"
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {initialData ? 'Update Driver' : 'Add Driver'}
                </button>
                
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
