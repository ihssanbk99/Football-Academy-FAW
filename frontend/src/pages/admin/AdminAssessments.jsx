import { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminAssessments.css';

const emptyForm = {
    player_id: '',
    coach_id: '',
    training_session_id: '',
    assessment_date: new Date().toISOString().split('T')[0],
    technical_score: '',
    tactical_score: '',
    physical_score: '',
    discipline_score: '',
    overall_score: '',
    strengths: '',
    areas_to_improve: '',
    notes: '',
};

function AdminAssessments() {
    const [assessments, setAssessments] = useState([]);
    const [players, setPlayers] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [trainingSessions, setTrainingSessions] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');

            const [
                assessmentsResponse,
                playersResponse,
                coachesResponse,
                trainingResponse,
            ] = await Promise.all([
                api.get('/admin/assessments'),
                api.get('/admin/players'),
                api.get('/admin/coaches'),
                api.get('/admin/training'),
            ]);

            setAssessments(assessmentsResponse.data.assessments || []);
            setPlayers(playersResponse.data.players || []);
            setCoaches(coachesResponse.data.coaches || []);
            setTrainingSessions(
                trainingResponse.data.training_sessions || []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to load assessments data.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(false);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError('');

            const payload = {
                ...form,
                player_id: Number(form.player_id),
                coach_id: form.coach_id ? Number(form.coach_id) : null,
                training_session_id: form.training_session_id
                    ? Number(form.training_session_id)
                    : null,
                technical_score: form.technical_score
                    ? Number(form.technical_score)
                    : null,
                tactical_score: form.tactical_score
                    ? Number(form.tactical_score)
                    : null,
                physical_score: form.physical_score
                    ? Number(form.physical_score)
                    : null,
                discipline_score: form.discipline_score
                    ? Number(form.discipline_score)
                    : null,
                overall_score: form.overall_score
                    ? Number(form.overall_score)
                    : null,
            };

            if (editingId) {
                await api.patch(
                    `/admin/assessments/${editingId}`,
                    payload
                );
            } else {
                await api.post('/admin/assessments', payload);
            }

            await fetchData();
            resetForm();
        } catch (err) {
            const validationErrors = err.response?.data?.errors;

            if (validationErrors) {
                setError(
                    Object.values(validationErrors).flat().join(' ')
                );
            } else {
                setError(
                    err.response?.data?.message ||
                        'Unable to save assessment.'
                );
            }
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (assessment) => {
        setEditingId(assessment.id);
        setShowForm(true);
        setError('');

        setForm({
            player_id:
                assessment.player_id ||
                assessment.player?.id ||
                '',
            coach_id:
                assessment.coach_id ||
                assessment.coach?.id ||
                '',
            training_session_id:
                assessment.training_session_id ||
                assessment.trainingSession?.id ||
                '',
            assessment_date: assessment.assessment_date
                ? assessment.assessment_date.substring(0, 10)
                : '',
            technical_score: assessment.technical_score || '',
            tactical_score: assessment.tactical_score || '',
            physical_score: assessment.physical_score || '',
            discipline_score: assessment.discipline_score || '',
            overall_score: assessment.overall_score || '',
            strengths: assessment.strengths || '',
            areas_to_improve: assessment.areas_to_improve || '',
            notes: assessment.notes || '',
        });
    };

    const handleDelete = async (id) => {
        if (
            !window.confirm(
                'Are you sure you want to delete this assessment?'
            )
        ) {
            return;
        }

        try {
            setError('');

            await api.delete(`/admin/assessments/${id}`);

            setAssessments((current) =>
                current.filter(
                    (assessment) => assessment.id !== id
                )
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to delete assessment.'
            );
        }
    };

    const getPlayerName = (assessment) => {
        if (assessment.player) {
            return `${assessment.player.first_name} ${assessment.player.last_name}`;
        }

        const player = players.find(
            (item) => item.id === assessment.player_id
        );

        return player
            ? `${player.first_name} ${player.last_name}`
            : 'Unknown Player';
    };

    if (loading) {
        return (
            <div className="admin-assessments-page">
                Loading...
            </div>
        );
    }

    return (
        <div className="admin-assessments-page">
            <div className="admin-assessments-header">
                <div>
                    <h1>Player Assessments</h1>
                    <p>
                        Track player development and performance.
                    </p>
                </div>

                <button
                    className="assessment-primary-button"
                    onClick={() => {
                        setForm({
                            ...emptyForm,
                            assessment_date: new Date()
                                .toISOString()
                                .split('T')[0],
                        });
                        setEditingId(null);
                        setError('');
                        setShowForm(true);
                    }}
                >
                    + Add Assessment
                </button>
            </div>

            {error && (
                <div className="assessment-error">
                    {error}
                </div>
            )}

            {showForm && (
                <div className="assessment-form-card">
                    <div className="assessment-form-header">
                        <div>
                            <h2>
                                {editingId
                                    ? 'Edit Assessment'
                                    : 'Create Assessment'}
                            </h2>

                            <p>
                                Record the player's current development
                                level.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="assessment-close-button"
                            onClick={resetForm}
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="assessment-form-grid">
                            <div className="assessment-field">
                                <label>Player</label>

                                <select
                                    name="player_id"
                                    value={form.player_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Select player
                                    </option>

                                    {players.map((player) => (
                                        <option
                                            key={player.id}
                                            value={player.id}
                                        >
                                            {player.first_name}{' '}
                                            {player.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="assessment-field">
                                <label>Coach</label>

                                <select
                                    name="coach_id"
                                    value={form.coach_id}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        Select coach
                                    </option>

                                    {coaches.map((coach) => (
                                        <option
                                            key={coach.id}
                                            value={coach.id}
                                        >
                                            {coach.full_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="assessment-field">
                                <label>Training Session</label>

                                <select
                                    name="training_session_id"
                                    value={form.training_session_id}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        Select training session
                                    </option>

                                    {trainingSessions.map(
                                        (session) => (
                                            <option
                                                key={session.id}
                                                value={session.id}
                                            >
                                                {session.title}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="assessment-field">
                                <label>Assessment Date</label>

                                <input
                                    type="date"
                                    name="assessment_date"
                                    value={form.assessment_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="assessment-scores-section">
                            <h3>Performance Scores</h3>

                            <div className="assessment-score-grid">
                                {[
                                    [
                                        'technical_score',
                                        'Technical',
                                    ],
                                    [
                                        'tactical_score',
                                        'Tactical',
                                    ],
                                    [
                                        'physical_score',
                                        'Physical',
                                    ],
                                    [
                                        'discipline_score',
                                        'Discipline',
                                    ],
                                    [
                                        'overall_score',
                                        'Overall',
                                    ],
                                ].map(([name, label]) => (
                                    <div
                                        className="assessment-score-field"
                                        key={name}
                                    >
                                        <label>{label}</label>

                                        <select
                                            name={name}
                                            value={form[name]}
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Score
                                            </option>

                                            {Array.from(
                                                { length: 10 },
                                                (_, index) =>
                                                    index + 1
                                            ).map((score) => (
                                                <option
                                                    key={score}
                                                    value={score}
                                                >
                                                    {score} / 10
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="assessment-text-grid">
                            <div className="assessment-field">
                                <label>Strengths</label>

                                <textarea
                                    name="strengths"
                                    value={form.strengths}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Player's strengths..."
                                />
                            </div>

                            <div className="assessment-field">
                                <label>Areas To Improve</label>

                                <textarea
                                    name="areas_to_improve"
                                    value={form.areas_to_improve}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Areas that need improvement..."
                                />
                            </div>

                            <div className="assessment-field assessment-field-full">
                                <label>Notes</label>

                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Additional notes..."
                                />
                            </div>
                        </div>

                        <div className="assessment-form-actions">
                            <button
                                type="button"
                                className="assessment-secondary-button"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="assessment-primary-button"
                                disabled={saving}
                            >
                                {saving
                                    ? 'Saving...'
                                    : editingId
                                    ? 'Update Assessment'
                                    : 'Save Assessment'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="assessment-list-card">
                <div className="assessment-list-header">
                    <div>
                        <h2>Assessment Records</h2>
                        <p>
                            {assessments.length} assessment records
                        </p>
                    </div>
                </div>

                {assessments.length === 0 ? (
                    <div className="assessment-empty">
                        <div className="assessment-empty-icon">
                            ⚽
                        </div>

                        <h3>No assessments yet</h3>

                        <p>
                            Create the first player assessment.
                        </p>
                    </div>
                ) : (
                    <div className="assessment-table-wrapper">
                        <table className="assessment-table">
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Coach</th>
                                    <th>Date</th>
                                    <th>Technical</th>
                                    <th>Tactical</th>
                                    <th>Physical</th>
                                    <th>Discipline</th>
                                    <th>Overall</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {assessments.map(
                                    (assessment) => (
                                        <tr key={assessment.id}>
                                            <td>
                                                <strong>
                                                    {getPlayerName(
                                                        assessment
                                                    )}
                                                </strong>
                                            </td>

                                            <td>
                                                {assessment.coach
                                                    ?.full_name ||
                                                    '—'}
                                            </td>

                                            <td>
                                                {assessment.assessment_date
                                                    ? new Date(
                                                          assessment.assessment_date
                                                      ).toLocaleDateString()
                                                    : '—'}
                                            </td>

                                            <td>
                                                <span className="assessment-score">
                                                    {assessment.technical_score ??
                                                        '—'}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="assessment-score">
                                                    {assessment.tactical_score ??
                                                        '—'}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="assessment-score">
                                                    {assessment.physical_score ??
                                                        '—'}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="assessment-score">
                                                    {assessment.discipline_score ??
                                                        '—'}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="assessment-score assessment-score-overall">
                                                    {assessment.overall_score ??
                                                        '—'}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="assessment-actions">
                                                    <button
                                                        type="button"
                                                        className="assessment-edit-button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                assessment
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="assessment-delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                assessment.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
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

export default AdminAssessments;