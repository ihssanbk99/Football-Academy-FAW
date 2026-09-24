import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function ParentDashboard() {
    const { user, logout } = useAuth();
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/parent/players')
            .then((res) => setPlayers(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Parent Portal</h1>
                        <p className="text-gray-600">Welcome back, {user?.name}!</p>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            to="/parent/register-player"
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow transition"
                        >
                            + Register New Player
                        </Link>
                        <button
                            onClick={logout}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* My Registered Players Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Registered Children</h2>

                    {loading ? (
                        <p className="text-gray-500 py-4">Loading players...</p>
                    ) : players.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500 mb-4">No children registered yet.</p>
                            <Link
                                to="/parent/register-player"
                                className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
                            >
                                Register First Player
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {players.map((player) => (
                                <div key={player.id} className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-md transition">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">{player.name}</h3>
                                            <p className="text-xs text-gray-500">DOB: {player.date_of_birth}</p>
                                        </div>
                                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded">
                                            #{player.jersey_number}
                                        </span>
                                    </div>

                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p><span className="font-semibold text-gray-700">Age Group:</span> {player.age_group?.name || 'N/A'}</p>
                                        <p><span className="font-semibold text-gray-700">Uniform Size:</span> {player.uniform_size}</p>
                                        <p>
                                            <span className="font-semibold text-gray-700">Transportation:</span>{' '}
                                            {player.needs_transportation ? (
                                                <span className="text-green-600 font-medium">{player.route?.name || 'Assigned'}</span>
                                            ) : (
                                                <span className="text-gray-400">Not Requested</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}