import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function RegisterPlayer() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        date_of_birth: '',
        age_group_id: '',
        uniform_size: 'M',
        jersey_number: '',
        needs_transportation: false,
        route_id: '',
    });

    const [ageGroups, setAgeGroups] = useState([]);
    const [availableNumbers, setAvailableNumbers] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loadingNumbers, setLoadingNumbers] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/age-groups')
            .then((res) => setAgeGroups(res.data))
            .catch(() => {});

        api.get('/transportation/routes')
            .then((res) => setRoutes(res.data))
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!formData.age_group_id) {
            setAvailableNumbers([]);
            return;
        }

        setLoadingNumbers(true);
        api.get(`/jersey-numbers/available?age_group_id=${formData.age_group_id}`)
            .then((res) => setAvailableNumbers(res.data))
            .catch(() => setAvailableNumbers([]))
            .finally(() => setLoadingNumbers(false));
    }, [formData.age_group_id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            await api.post('/players', formData);
            navigate('/parent/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register player.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Register New Player</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Player Full Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input
                            type="date"
                            name="date_of_birth"
                            required
                            value={formData.date_of_birth}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                        <select
                            name="age_group_id"
                            required
                            value={formData.age_group_id}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Select Age Group</option>
                            {ageGroups.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.name} ({group.min_age} - {group.max_age} years)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Uniform Size</label>
                            <select
                                name="uniform_size"
                                value={formData.uniform_size}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="XS">XS (Ages 5-7)</option>
                                <option value="S">S (Ages 8-10)</option>
                                <option value="M">M (Ages 11-13)</option>
                                <option value="L">L (Ages 14-15)</option>
                                <option value="XL">XL (Ages 16-17)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jersey Number</label>
                            <select
                                name="jersey_number"
                                required
                                disabled={!formData.age_group_id || loadingNumbers}
                                value={formData.jersey_number}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                            >
                                <option value="">
                                    {loadingNumbers ? 'Loading numbers...' : 'Select Number'}
                                </option>
                                {availableNumbers.map((num) => (
                                    <option key={num} value={num}>
                                        #{num}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="needs_transportation"
                                checked={formData.needs_transportation}
                                onChange={handleChange}
                                className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Request Bus Transportation</span>
                        </label>
                    </div>

                    {formData.needs_transportation && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bus Route / Area</label>
                            <select
                                name="route_id"
                                required={formData.needs_transportation}
                                value={formData.route_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Select Transportation Route</option>
                                {routes.map((route) => (
                                    <option key={route.id} value={route.id}>
                                        {route.name} - ({route.start_time})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/parent/dashboard')}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md disabled:opacity-50"
                        >
                            {submitting ? 'Registering...' : 'Complete Registration'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}