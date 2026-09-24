import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function CoachDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [assignedGroups, setAssignedGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/coach/age-groups')
            .then((res) => {
                setAssignedGroups(res.data || []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Coach Dashboard</h1>
                        <p className="text-gray-600">Welcome, Coach {user?.name}!</p>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
                    >
                        Logout
                    </button>
                </div>

                {/* Main Actions */}
                <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Daily Training & Attendance</h2>
                        <p className="text-sm text-gray-500">Record player attendance, evaluate performance, and leave session notes.</p>
                    </div>
                    <button
                        onClick={() => navigate('/coach/attendance')}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 rounded transition"
                    >
                        📋 Take Attendance & Evaluation
                    </button>
                </div>

                {/* Assigned Age Groups */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Assigned Teams / Age Groups</h2>

                    {loading ? (
                        <p className="text-gray-500">Loading assigned groups...</p>
                    ) : assignedGroups.length === 0 ? (
                        <p className="text-gray-500 text-sm">No age groups currently assigned to you.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {assignedGroups.map((group) => (
                                <div key={group.id} className="border rounded-lg p-4 bg-gray-50">
                                    <h3 className="font-bold text-lg text-gray-800">{group.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Age Range: {group.min_age} - {group.max_age} Years
                                    </p>
                                    <p className="text-xs text-gray-600 mt-2">
                                        Total Players: <span className="font-bold">{group.players_count || 0}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}