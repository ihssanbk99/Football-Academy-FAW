import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function DriverDashboard() {
    const { user, logout } = useAuth();
    const [assignedRoute, setAssignedRoute] = useState(null);
    const [passengers, setPassengers] = useState([]);
    const [pickupStatus, setPickupStatus] = useState({});
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        // Fetch assigned route and player manifest
        api.get('/driver/route')
            .then((res) => {
                setAssignedRoute(res.data.route);
                setPassengers(res.data.players || []);
                
                const initialStatus = {};
                (res.data.players || []).forEach((p) => {
                    initialStatus[p.id] = p.pickup_status || 'pending';
                });
                setPickupStatus(initialStatus);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleStatusToggle = (playerId, status) => {
        setPickupStatus((prev) => ({
            ...prev,
            [playerId]: status,
        }));
    };

    const handleSaveStatus = async () => {
        setUpdating(true);
        try {
            await api.post('/driver/pickup-status', {
                statuses: Object.keys(pickupStatus).map((id) => ({
                    player_id: id,
                    status: pickupStatus[id],
                })),
            });
            alert('Passenger statuses updated successfully!');
        } catch (err) {
            alert('Failed to update passenger statuses.');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Driver Portal</h1>
                        <p className="text-gray-600">Welcome, Driver {user?.name}!</p>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                    >
                        Logout
                    </button>
                </div>

                {/* Route Information */}
                {loading ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                        Loading route details...
                    </div>
                ) : !assignedRoute ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                        No active bus route assigned to your account.
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="border-b pb-4 mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Route: {assignedRoute.name}</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Departure Time: <span className="font-semibold text-gray-700">{assignedRoute.start_time}</span>
                            </p>
                        </div>

                        <h3 className="text-lg font-bold text-gray-800 mb-4">Passenger Manifest ({passengers.length} Players)</h3>

                        {passengers.length === 0 ? (
                            <p className="text-gray-500 text-sm">No players assigned to this route today.</p>
                        ) : (
                            <div className="space-y-3">
                                {passengers.map((player) => (
                                    <div
                                        key={player.id}
                                        className="flex justify-between items-center p-4 border rounded-lg bg-gray-50"
                                    >
                                        <div>
                                            <p className="font-bold text-gray-800">{player.name}</p>
                                            <p className="text-xs text-gray-500">Parent: {player.parent_name} ({player.parent_phone})</p>
                                        </div>

                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => handleStatusToggle(player.id, 'picked_up')}
                                                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                                                    pickupStatus[player.id] === 'picked_up'
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                            >
                                                Boarded 🚌
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleStatusToggle(player.id, 'dropped_off')}
                                                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                                                    pickupStatus[player.id] === 'dropped_off'
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                            >
                                                Dropped Off ✅
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleStatusToggle(player.id, 'absent')}
                                                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                                                    pickupStatus[player.id] === 'absent'
                                                        ? 'bg-red-600 text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                            >
                                                Absent ❌
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-4 flex justify-end">
                                    <button
                                        onClick={handleSaveStatus}
                                        disabled={updating}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition disabled:opacity-50"
                                    >
                                        {updating ? 'Saving...' : 'Save Manifest Status'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}