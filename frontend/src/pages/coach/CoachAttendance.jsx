import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import './CoachAttendance.css';

export default function CoachAttendance() {
    const [attendances, setAttendances] = useState([]);
    const [players, setPlayers] = useState([]);
    const [trainingSessions, setTrainingSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState('');
    const [statuses, setStatuses] = useState({});
    const [notes, setNotes] = useState({});
    const [loading, setLoading] = useState(true);
    const [savingPlayerId, setSavingPlayerId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchAttendance = async () => {
        try {
            setLoading(true);

            const response = await api.get('/coach/attendance');

            const dataAttendances = response.data.attendances || [];
            const dataPlayers = response.data.players || [];
            const dataSessions = response.data.training_sessions || [];

            setAttendances(dataAttendances);
            setPlayers(dataPlayers);
            setTrainingSessions(dataSessions);

            setSelectedSessionId((current) => {
                if (
                    current &&
                    dataSessions.some(
                        (session) =>
                            String(session.id) === String(current)
                    )
                ) {
                    return current;
                }

                return dataSessions.length
                    ? String(dataSessions[0].id)
                    : '';
            });

            const nextStatuses = {};
            const nextNotes = {};

            dataAttendances.forEach((attendance) => {
                const key = `${attendance.training_session_id}-${attendance.player_id}`;

                nextStatuses[key] = attendance.status;
                nextNotes[key] = attendance.notes || '';
            });

            setStatuses(nextStatuses);
            setNotes(nextNotes);
            setError('');
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

    const selectedSession = useMemo(
        () =>
            trainingSessions.find(
                (session) =>
                    String(session.id) === String(selectedSessionId)
            ),
        [trainingSessions, selectedSessionId]
    );

    const sessionPlayers = useMemo(() => {
        if (!selectedSession) {
            return [];
        }

        return players.filter(
            (player) =>
                String(player.age_group_id) ===
                String(selectedSession.age_group_id)
        );
    }, [players, selectedSession]);

    const getKey = (playerId) =>
        `${selectedSessionId}-${playerId}`;

    const handleStatusChange = (playerId, status) => {
        setStatuses((current) => ({
            ...current,
            [getKey(playerId)]: status,
        }));
    };

    const handleNotesChange = (playerId, value) => {
        setNotes((current) => ({
            ...current,
            [getKey(playerId)]: value,
        }));
    };

    const handleSave = async (player) => {
        if (!selectedSessionId) {
            return;
        }

        try {
            setSavingPlayerId(player.id);
            setError('');
            setSuccess('');

            await api.post('/coach/attendance', {
                training_session_id: Number(selectedSessionId),
                player_id: player.id,
                status: statuses[getKey(player.id)] || 'present',
                notes: notes[getKey(player.id)] || null,
            });

            setSuccess(
                `Attendance saved for ${player.first_name} ${player.last_name}.`
            );

            await fetchAttendance();
        } catch (err) {
            const validationErrors = err.response?.data?.errors;

            if (validationErrors) {
                setError(
                    Object.values(validationErrors)
                        .flat()
                        .join(' ')
                );
            } else {
                setError(
                    err.response?.data?.message ||
                        'Unable to save attendance.'
                );
            }
        } finally {
            setSavingPlayerId(null);
        }
    };

    if (loading) {
        return (
            <div className="coach-attendance-page">
                <div className="coach-attendance-loading">
                    Loading attendance...
                </div>
            </div>
        );
    }

    return (
        <div className="coach-attendance-page">
            <div className="coach-attendance-header">
                <div>
                    <span className="coach-attendance-eyebrow">
                        COACH PORTAL
                    </span>

                    <h1>Attendance</h1>

                    <p>
                        Record attendance for players assigned to
                        your training sessions.
                    </p>
                </div>
            </div>

            {error && (
                <div className="coach-attendance-message error">
                    {error}
                </div>
            )}

            {success && (
                <div className="coach-attendance-message success">
                    {success}
                </div>
            )}

            <div className="coach-attendance-filter-card">
                <label htmlFor="training-session">
                    Training Session
                </label>

                <select
                    id="training-session"
                    value={selectedSessionId}
                    onChange={(e) => {
                        setSelectedSessionId(e.target.value);
                        setError('');
                        setSuccess('');
                    }}
                >
                    <option value="">
                        Select a training session
                    </option>

                    {trainingSessions.map((session) => (
                        <option
                            key={session.id}
                            value={session.id}
                        >
                            {session.title} —{' '}
                            {session.age_group?.name || 'Age Group'} —{' '}
                            {session.session_date}
                        </option>
                    ))}
                </select>
            </div>

            {!selectedSessionId ? (
                <div className="coach-attendance-empty">
                    Select a training session to manage attendance.
                </div>
            ) : sessionPlayers.length === 0 ? (
                <div className="coach-attendance-empty">
                    No assigned players found for this training
                    session.
                </div>
            ) : (
                <div className="coach-attendance-table-card">
                    <div className="coach-attendance-table-wrapper">
                        <table className="coach-attendance-table">
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Age Group</th>
                                    <th>Status</th>
                                    <th>Notes</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {sessionPlayers.map((player) => {
                                    const key = getKey(player.id);
                                    const currentStatus =
                                        statuses[key] || 'present';

                                    return (
                                        <tr key={player.id}>
                                            <td>
                                                <strong>
                                                    {player.first_name}{' '}
                                                    {player.last_name}
                                                </strong>
                                            </td>

                                            <td>
                                                {player.age_group?.name ||
                                                    '-'}
                                            </td>

                                            <td>
                                                <select
                                                    value={currentStatus}
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            player.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`attendance-status-select ${currentStatus}`}
                                                >
                                                    <option value="present">
                                                        Present
                                                    </option>
                                                    <option value="absent">
                                                        Absent
                                                    </option>
                                                    <option value="late">
                                                        Late
                                                    </option>
                                                </select>
                                            </td>

                                            <td>
                                                <input
                                                    type="text"
                                                    value={
                                                        notes[key] || ''
                                                    }
                                                    onChange={(e) =>
                                                        handleNotesChange(
                                                            player.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Optional"
                                                />
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className="coach-attendance-save"
                                                    onClick={() =>
                                                        handleSave(player)
                                                    }
                                                    disabled={
                                                        savingPlayerId ===
                                                        player.id
                                                    }
                                                >
                                                    {savingPlayerId ===
                                                    player.id
                                                        ? 'Saving...'
                                                        : 'Save'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}