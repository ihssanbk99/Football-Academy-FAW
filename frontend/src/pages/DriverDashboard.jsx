import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('ageGroups');

    // Data states
    const [ageGroups, setAgeGroups] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form states
    const [newAgeGroup, setNewAgeGroup] = useState({ name: '', min_age: '', max_age: '' });
    const [newRoute, setNewRoute] = useState({ name: '', start_time: '' });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'ageGroups') {
                const res = await api.get('/age-groups');
                setAgeGroups(res.data);
            } else if (activeTab === 'routes') {
                const res = await api.get('/transportation/routes');
                setRoutes(res.data);
            }
        } catch (err) {
            console.error('Failed to load admin data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAgeGroup = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/age-groups', newAgeGroup);
            setNewAgeGroup({ name: '', min_age: '', max_age: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add age group');
        }
    };

    const handleAddRoute = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/routes', newRoute);
            setNewRoute({ name: '', start_time: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add route');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Admin Control Panel</h1>
                        <p className="text-gray-600">Welcome back, {user?.name}!</p>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
                    >
                        Logout
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 bg-white rounded-t-lg shadow-sm">
                    <button
                        onClick={() => setActiveTab('ageGroups')}
                        className={`py-4 px-6 font-semibold text-sm transition border-b-2 ${
                            activeTab === 'ageGroups'
                                ? 'border-green-600 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        🏆 Age Groups
                    </button>
                    <button
                        onClick={() => setActiveTab('routes')}
                        className={`py-4 px-6 font-semibold text-sm transition border-b-2 ${
                            activeTab === 'routes'
                                ? 'border-green-600 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        🚌 Transportation Routes
                    </button>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-b-lg shadow p-6">
                    {activeTab === 'ageGroups' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800">Manage Age Groups</h2>

                            <form onSubmit={handleAddAgeGroup} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                                <input
                                    type="text"
                                    placeholder="Group Name (e.g. Under 12)"
                                    required
                                    value={newAgeGroup.name}
                                    onChange={(e) => setNewAgeGroup({ ...newAgeGroup, name: e.target.value })}
                                    className="px-3 py-2 border rounded-md"
                                />
                                <input
                                    type="number"
                                    placeholder="Min Age"
                                    required
                                    value={newAgeGroup.min_age}
                                    onChange={(e) => setNewAgeGroup({ ...newAgeGroup, min_age: e.target.value })}
                                    className="px-3 py-2 border rounded-md"
                                />
                                <input
                                    type="number"
                                    placeholder="Max Age"
                                    required
                                    value={newAgeGroup.max_age}
                                    onChange={(e) => setNewAgeGroup({ ...newAgeGroup, max_age: e.target.value })}
                                    className="px-3 py-2 border rounded-md"
                                />
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
                                >
                                    + Add Group
                                </button>
                            </form>

                            {loading ? (
                                <p className="text-gray-500">Loading age groups...</p>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 border-b text-gray-700">
                                            <th className="py-3 px-4">Group Name</th>
                                            <th className="py-3 px-4">Min Age</th>
                                            <th className="py-3 px-4">Max Age</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ageGroups.map((group) => (
                                            <tr key={group.id} className="border-b">
                                                <td className="py-3 px-4 font-semibold text-gray-800">{group.name}</td>
                                                <td className="py-3 px-4 text-gray-600">{group.min_age} years</td>
                                                <td className="py-3 px-4 text-gray-600">{group.max_age} years</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {activeTab === 'routes' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800">Manage Bus Routes</h2>

                            <form onSubmit={handleAddRoute} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                                <input
                                    type="text"
                                    placeholder="Route / Area Name"
                                    required
                                    value={newRoute.name}
                                    onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                                    className="px-3 py-2 border rounded-md"
                                />
                                <input
                                    type="time"
                                    required
                                    value={newRoute.start_time}
                                    onChange={(e) => setNewRoute({ ...newRoute, start_time: e.target.value })}
                                    className="px-3 py-2 border rounded-md"
                                />
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
                                >
                                    + Add Route
                                </button>
                            </form>

                            {loading ? (
                                <p className="text-gray-500">Loading routes...</p>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 border-b text-gray-700">
                                            <th className="py-3 px-4">Route Name</th>
                                            <th className="py-3 px-4">Departure Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {routes.map((route) => (
                                            <tr key={route.id} className="border-b">
                                                <td className="py-3 px-4 font-semibold text-gray-800">{route.name}</td>
                                                <td className="py-3 px-4 text-gray-600">{route.start_time}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}