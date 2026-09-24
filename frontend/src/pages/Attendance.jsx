import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Attendance() {
    const { user, logout } = useAuth();
    const [ageGroups, setAgeGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [players, setPlayers] = useState([]);
    const [attendanceData, setAttendanceData] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Fetch age groups for the coach
        api.get('/coach/age-groups')
            .then((res) => {
                setAgeGroups(res.data);
                if (res.data.length > 0) {
                    setSelectedGroup(res.data[0].id);
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!selectedGroup) return;

        setLoading(true);
        api.get(`/coach/age-groups/${selectedGroup}/players`)
            .then((res) => {
                setPlayers(res.data);
                const initialData = {};
                res.data.forEach((p) => {
                    initialData[p.id] = {
                        status: p.today_attendance?.status || 'present',
                        rating: p.today_attendance?.rating || 5,
                        notes: p.today_attendance?.notes || '',
                    };
                });
                setAttendanceData(initialData);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [selectedGroup]);

    const handleFieldChange = (playerId, field, value) => {
        setAttendanceData((prev) => ({
            ...prev,
            [playerId]: {
                ...prev[playerId],
                [field]: value,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/coach/attendance', {
                age_group_id: selectedGroup,
                records: Object.keys(attendanceData).map((id) => ({
                    player_id: id,
                    ...attendanceData[id],
                })),
            });
            alert('Attendance and evaluations saved successfully!');
        } catch (err) {
            alert('Failed to save attendance records.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Attendance & Evaluation</h1>
                        <p className="text-gray-600">Coach: {user?.name}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                    >
                        Logout
                    </button>
                </div>

                {/* Group Selector */}
                <div className="bg-white rounded-lg shadow p-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Age Group:</label>
                    <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        className="w-full md:w-1/3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        {ageGroups.map((group) => (
                            <option key={group.id} value={group.id}>
                                {group.name} ({group.min_age}-{group.max_age} YRS)
                            </option>
                        ))}
                    </select>
                </div>

                {/* Player List Table */}
                {loading ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                        Loading roster...
                    </div>
                ) : players.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                        No players found in this age group.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 border-b text-gray-700 text-sm">
                                        <th className="py-3 px-4">Player Name</th>
                                        <th className="py-3 px-4">Jersey #</th>
                                        <th className="py-3 px-4">Attendance</th>
                                        <th className="py-3 px-4">Rating (1-10)</th>
                                        <th className="py-3 px-4">Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {players.map((player) => (
                                        <tr key={player.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 font-bold text-gray-800">{player.name}</td>
                                            <td className="py-3 px-4 font-mono text-gray-600">#{player.jersey_number}</td>
                                            <td className="py-3 px-4">
                                                <select
                                                    value={attendanceData[player.id]?.status || 'present'}
                                                    onChange={(e) => handleFieldChange(player.id, 'status', e.target.value)}
                                                    className="px-2 py-1 border rounded text-sm"
                                                >
                                                    <option value="present">Present ✅</option>
                                                    <option value="absent">Absent ❌</option>
                                                    <option value="excused">Excused 🟡</option>
                                                </select>
                                            </td>
                                            <td className="py-3 px-4">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    value={attendanceData[player.id]?.rating || 5}
                                                    onChange={(e) => handleFieldChange(player.id, 'rating', Number(e.target.value))}
                                                    className="w-16 px-2 py-1 border rounded text-sm text-center"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <input
                                                    type="text"
                                                    placeholder="Session feedback..."
                                                    value={attendanceData[player.id]?.notes || ''}
                                                    onChange={(e) => handleFieldChange(player.id, 'notes', e.target.value)}
                                                    className="w-full px-2 py-1 border rounded text-sm"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Attendance & Ratings'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}