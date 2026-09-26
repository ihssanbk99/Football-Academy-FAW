import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import './ParentAttendance.css';

export default function ParentAttendance() {
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedPlayerId, setSelectedPlayerId] = useState('all');

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await api.get('/attendance');

            setAttendances(response.data.attendances || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to load attendance.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const players = useMemo(() => {
        const uniquePlayers = new Map();

        attendances.forEach((attendance) => {
            const player = attendance.player;

            if (player?.id && !uniquePlayers.has(player.id)) {
                uniquePlayers.set(player.id, player);
            }
        });

        return Array.from(uniquePlayers.values()).sort((a, b) =>
            `${a.first_name} ${a.last_name}`.localeCompare(
                `${b.first_name} ${b.last_name}`
            )
        );
    }, [attendances]);

    const filteredAttendances = useMemo(() => {
        if (selectedPlayerId === 'all') {
            return attendances;
        }

        return attendances.filter(
            (attendance) =>
                String(attendance.player_id) ===
                String(selectedPlayerId)
        );
    }, [attendances, selectedPlayerId]);

    const getStatusLabel = (status) => {
        if (status === 'present') {
            return 'Present';
        }

        if (status === 'absent') {
            return 'Absent';
        }

        if (status === 'late') {
            return 'Late';
        }

        return status;
    };

    const getStatusClass = (status) => {
        if (status === 'present') {
            return 'present';
        }

        if (status === 'absent') {
            return 'absent';
        }

        if (status === 'late') {
            return 'late';
        }

        return '';
    };

    const formatDate = (date) => {
        if (!date) {
            return '-';
        }

        return new Date(`${date}T00:00:00`).toLocaleDateString(
            'en-US',
            {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }
        );
    };

    if (loading) {
        return (
            <div className="parent-attendance-page">
                <div className="parent-attendance-loading">
                    Loading attendance...
                </div>
            </div>
        );
    }

    return (
        <div className="parent-attendance-page">
            <div className="parent-attendance-header">
                <div>
                    <span className="parent-attendance-eyebrow">
                        PARENT PORTAL
                    </span>

                    <h1>Attendance</h1>

                    <p>
                        View attendance records for your children.
                    </p>
                </div>
            </div>

            {error && (
                <div className="parent-attendance-error">
                    {error}
                </div>
            )}

            <div className="parent-attendance-summary">
                <div className="parent-attendance-summary-card">
                    <span>Total Records</span>
                    <strong>{filteredAttendances.length}</strong>
                </div>

                <div className="parent-attendance-summary-card present">
                    <span>Present</span>
                    <strong>
                        {
                            filteredAttendances.filter(
                                (attendance) =>
                                    attendance.status ===
                                    'present'
                            ).length
                        }
                    </strong>
                </div>

                <div className="parent-attendance-summary-card late">
                    <span>Late</span>
                    <strong>
                        {
                            filteredAttendances.filter(
                                (attendance) =>
                                    attendance.status === 'late'
                            ).length
                        }
                    </strong>
                </div>

                <div className="parent-attendance-summary-card absent">
                    <span>Absent</span>
                    <strong>
                        {
                            filteredAttendances.filter(
                                (attendance) =>
                                    attendance.status === 'absent'
                            ).length
                        }
                    </strong>
                </div>
            </div>

            <div className="parent-attendance-filter-card">
                <label htmlFor="parent-attendance-player">
                    Player
                </label>

                <select
                    id="parent-attendance-player"
                    value={selectedPlayerId}
                    onChange={(event) =>
                        setSelectedPlayerId(event.target.value)
                    }
                >
                    <option value="all">
                        All Children
                    </option>

                    {players.map((player) => (
                        <option
                            key={player.id}
                            value={player.id}
                        >
                            {player.first_name} {player.last_name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="parent-attendance-table-card">
                <div className="parent-attendance-table-header">
                    <div>
                        <h2>Attendance Records</h2>

                        <p>
                            Attendance history for your children.
                        </p>
                    </div>

                    <span>
                        {filteredAttendances.length} records
                    </span>
                </div>

                {filteredAttendances.length === 0 ? (
                    <div className="parent-attendance-empty">
                        No attendance records found.
                    </div>
                ) : (
                    <div className="parent-attendance-table-wrapper">
                        <table className="parent-attendance-table">
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Training</th>
                                    <th>Date</th>
                                    <th>Age Group</th>
                                    <th>Coach</th>
                                    <th>Status</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredAttendances.map(
                                    (attendance) => (
                                        <tr
                                            key={
                                                attendance.id
                                            }
                                        >
                                            <td>
                                                <strong>
                                                    {
                                                        attendance
                                                            .player
                                                            ?.first_name
                                                    }{' '}
                                                    {
                                                        attendance
                                                            .player
                                                            ?.last_name
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                {attendance
                                                    .trainingSession
                                                    ?.title ||
                                                    '-'}
                                            </td>

                                            <td>
                                                {formatDate(
                                                    attendance
                                                        .trainingSession
                                                        ?.session_date
                                                )}
                                            </td>

                                            <td>
                                                {attendance
                                                    .trainingSession
                                                    ?.ageGroup
                                                    ?.name ||
                                                    '-'}
                                            </td>

                                            <td>
                                                {attendance
                                                    .trainingSession
                                                    ?.coach
                                                    ?.full_name ||
                                                    '-'}
                                            </td>

                                            <td>
                                                <span
                                                    className={`parent-attendance-status ${getStatusClass(
                                                        attendance.status
                                                    )}`}
                                                >
                                                    {getStatusLabel(
                                                        attendance.status
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                {attendance.notes ||
                                                    '-'}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}