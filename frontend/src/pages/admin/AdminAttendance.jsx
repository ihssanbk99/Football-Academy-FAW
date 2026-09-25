import { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminAttendance.css';

function AdminAttendance() {
    const [attendances, setAttendances] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        training_session_id: '',
        player_id: '',
        status: 'present',
        notes: '',
    });

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            const [attendanceResponse, sessionsResponse, playersResponse] = await Promise.all([
                api.get('/admin/attendance'),
                api.get('/admin/training'),
                api.get('/admin/players'),
            ]);

            setAttendances(attendanceResponse.data.attendances || []);
            setSessions(sessionsResponse.data.sessions || sessionsResponse.data.training_sessions || []);
            setPlayers(playersResponse.data.players || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load attendance data.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.training_session_id || !form.player_id) {
            setError('Please select a training session and player.');
            return;
        }

        try {
            setSaving(true);
            setError('');

            await api.post('/admin/attendance', form);

            setForm({
                training_session_id: '',
                player_id: '',
                status: 'present',
                notes: '',
            });

            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                Object.values(err.response?.data?.errors || {})?.[0]?.[0] ||
                'Unable to save attendance.'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async (attendance, status) => {
        try {
            setError('');

            await api.patch(`/admin/attendance/${attendance.id}`, {
                status,
                notes: attendance.notes || '',
            });

            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to update attendance.'
            );
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this attendance record?')) {
            return;
        }

        try {
            setError('');

            await api.delete(`/admin/attendance/${id}`);

            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to delete attendance.'
            );
        }
    };

    if (loading) {
        return (
            <div className="admin-attendance-page">
                <div className="admin-attendance-loading">
                    Loading attendance...
                </div>
            </div>
        );
    }

    return (
        <div className="admin-attendance-page">
            <div className="admin-attendance-header">
                <div>
                    <h1>Attendance</h1>
                    <p>Manage player attendance for training sessions.</p>
                </div>
            </div>

            {error && (
                <div className="admin-attendance-error">
                    {error}
                </div>
            )}

            <div className="admin-attendance-form-card">
                <h2>Record Attendance</h2>

                <form onSubmit={handleSubmit}>
                    <div className="admin-attendance-form-grid">
                        <div className="admin-attendance-field">
                            <label>Training Session</label>
                            <select
                                name="training_session_id"
                                value={form.training_session_id}
                                onChange={handleChange}
                            >
                                <option value="">Select session</option>
                                {sessions.map((session) => (
                                    <option key={session.id} value={session.id}>
                                        {session.title} - {session.session_date}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="admin-attendance-field">
                            <label>Player</label>
                            <select
                                name="player_id"
                                value={form.player_id}
                                onChange={handleChange}
                            >
                                <option value="">Select player</option>
                                {players.map((player) => (
                                    <option key={player.id} value={player.id}>
                                        {player.first_name} {player.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="admin-attendance-field">
                            <label>Status</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="late">Late</option>
                            </select>
                        </div>

                        <div className="admin-attendance-field">
                            <label>Notes</label>
                            <input
                                type="text"
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                placeholder="Optional notes"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="admin-attendance-submit"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Attendance'}
                    </button>
                </form>
            </div>

            <div className="admin-attendance-table-card">
                <div className="admin-attendance-table-header">
                    <h2>Attendance Records</h2>
                    <span>{attendances.length} records</span>
                </div>

                {attendances.length === 0 ? (
                    <div className="admin-attendance-empty">
                        No attendance records yet.
                    </div>
                ) : (
                    <div className="admin-attendance-table-wrapper">
                        <table className="admin-attendance-table">
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Training</th>
                                    <th>Date</th>
                                    <th>Age Group</th>
                                    <th>Coach</th>
                                    <th>Status</th>
                                    <th>Notes</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {attendances.map((attendance) => (
                                    <tr key={attendance.id}>
                                        <td>
                                            {attendance.player?.first_name}{' '}
                                            {attendance.player?.last_name}
                                        </td>

                                        <td>
                                            {attendance.trainingSession?.title || '-'}
                                        </td>

                                        <td>
                                            {attendance.trainingSession?.session_date || '-'}
                                        </td>

                                        <td>
                                            {attendance.trainingSession?.ageGroup?.name || '-'}
                                        </td>

                                        <td>
                                            {attendance.trainingSession?.coach?.full_name || '-'}
                                        </td>

                                        <td>
                                            <select
                                                className={`attendance-status-select ${attendance.status}`}
                                                value={attendance.status}
                                                onChange={(event) =>
                                                    handleStatusChange(
                                                        attendance,
                                                        event.target.value
                                                    )
                                                }
                                            >
                                                <option value="present">Present</option>
                                                <option value="absent">Absent</option>
                                                <option value="late">Late</option>
                                            </select>
                                        </td>

                                        <td>
                                            {attendance.notes || '-'}
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="admin-attendance-delete"
                                                onClick={() =>
                                                    handleDelete(attendance.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminAttendance;