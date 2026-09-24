import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function Attendance() {
    const [ageGroups, setAgeGroups] = useState([]);
    const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [players, setPlayers] = useState([]);
    const [attendanceData, setAttendanceData] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        api.get('/age-groups')
            .then((res) => setAgeGroups(res.data))
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!selectedAgeGroup) {
            setPlayers([]);
            return;
        }

        setLoading(true);
        api.get(`/coach/players?age_group_id=${selectedAgeGroup}&date=${date}`)
            .then((res) => {
                setPlayers(res.data);
                const initialStatus = {};
                res.data.forEach((player) => {
                    initialStatus[player.id] = {
                        status: player.attendance_status || 'present',
                        evaluation_notes: player.evaluation_notes || '',
                        performance_score: player.performance_score || 5,
                    };
                });
                setAttendanceData(initialStatus);
            })
            .catch(() => setPlayers([]))
            .finally(() => setLoading(false));
    }, [selectedAgeGroup, date]);

    const handleStatusChange = (playerId, status) => {
        setAttendanceData((prev) => ({
            ...prev,
            [playerId]: { ...prev[playerId], status },
        }));
    };

    const handleDataChange = (playerId, field, value) => {
        setAttendanceData((prev) => ({
            ...prev,
            [playerId]: { ...prev[playerId], [field]: value },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        const payload = {
            date,
            age_group_id: selectedAgeGroup,
            records: Object.keys(attendanceData).map((playerId) => ({
                player_id: playerId,
                ...attendanceData[playerId],
            })),
        };

        try {
            await api.post('/coach/attendance', payload);
            setMessage({ type: 'success', text: 'Attendance and evaluations saved successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save attendance.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Session Attendance & Performance</h2>

                {message.text && (
                    <div className={`p-4 rounded mb-4 text-sm font-medium ${
                        message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Age Group</label>
                        <select
                            value={selectedAgeGroup}
                            onChange={(e) => setSelectedAgeGroup(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="">-- Choose Age Group --</option>
                            {ageGroups.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center py-8 text-gray-500">Loading players list...</p>
                ) : !selectedAgeGroup ? (
                    <p className="text-center py-8 text-gray-400">Please select an age group to record attendance.</p>
                ) : players.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">No players registered in this age group.</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b text-gray-600 text-sm">
                                        <th className="py-3 px-4">#</th>
                                        <th className="py-3 px-4">Player Name</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4">Performance (1-10)</th>
                                        <th className="py-3 px-4">Coach Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {players.map((player) => (
                                        <tr key={player.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 font-bold text-gray-700">#{player.jersey_number}</td>
                                            <td className="py-3 px-4 font-semibold text-gray-800">{player.name}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusChange(player.id, 'present')}
                                                        className={`px-3 py-1 rounded text-xs font-bold ${
                                                            attendanceData[player.id]?.status === 'present'
                                                                ? 'bg-green-600 text-white'
                                                                : 'bg-gray-200 text-gray-700'
                                                        }`}
                                                    >
                                                        Present
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusChange(player.id, 'absent')}
                                                        className={`px-3 py-1 rounded text-xs font-bold ${
                                                            attendanceData[player.id]?.status === 'absent'
                                                                ? 'bg-red-600 text-white'
                                                                : 'bg-gray-200 text-gray-700'
                                                        }`}
                                                    >
                                                        Absent
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    value={attendanceData[player.id]?.performance_score || 5}
                                                    onChange={(e) => handleDataChange(player.id, 'performance_score', e.target.value)}
                                                    className="w-16 px-2 py-1 border rounded text-center"
                                                    disabled={attendanceData[player.id]?.status === 'absent'}
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Great passing skills"
                                                    value={attendanceData[player.id]?.evaluation_notes || ''}
                                                    onChange={(e) => handleDataChange(player.id, 'evaluation_notes', e.target.value)}
                                                    className="w-full px-2 py-1 border rounded text-sm"
                                                    disabled={attendanceData[player.id]?.status === 'absent'}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Attendance & Reviews'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}