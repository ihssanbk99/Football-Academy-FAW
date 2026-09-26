import { useEffect, useState } from 'react';
import api from '../../services/api';
import './CoachAssessments.css';

const createEmptyForm = () => ({
    player_id: '',
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
});

export default function CoachAssessments() {
    const [assessments, setAssessments] = useState([]);
    const [players, setPlayers] = useState([]);
    const [trainingSessions, setTrainingSessions] = useState([]);
    const [form, setForm] = useState(createEmptyForm());
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchAssessments = async () => {
        const response = await api.get('/coach/assessments');

        setAssessments(response.data.assessments || []);
    };

    const fetchPlayers = async () => {
        const response = await api.get('/coach/players');

        setPlayers(response.data.players || []);
    };

    const fetchTrainingSessions = async () => {
        const response = await api.get('/coach/attendance/options');

        setTrainingSessions(
            response.data.training_sessions || []
        );
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');

            await Promise.all([
                fetchAssessments(),
                fetchPlayers(),
                fetchTrainingSessions(),
            ]);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to load assessments.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setForm(createEmptyForm());
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            const payload = {
                player_id: Number(form.player_id),
                training_session_id:
                    form.training_session_id
                        ? Number(form.training_session_id)
                        : null,
                assessment_date: form.assessment_date,
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
                strengths: form.strengths || null,
                areas_to_improve:
                    form.areas_to_improve || null,
                notes: form.notes || null,
            };

            if (editingId) {
                await api.patch(
                    `/coach/assessments/${editingId}`,
                    payload
                );

                setSuccess(
                    'Assessment updated successfully.'
                );
            } else {
                await api.post('/coach/assessments', payload);

                setSuccess(
                    'Assessment created successfully.'
                );
            }

            resetForm();
            await fetchAssessments();
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
                        'Unable to save assessment.'
                );
            }
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (assessment) => {
        setEditingId(assessment.id);

        setForm({
            player_id:
                assessment.player_id ||
                assessment.player?.id ||
                '',
            training_session_id:
                assessment.training_session_id ||
                assessment.trainingSession?.id ||
                '',
            assessment_date:
                assessment.assessment_date?.split('T')[0] ||
                assessment.assessment_date ||
                '',
            technical_score:
                assessment.technical_score ?? '',
            tactical_score:
                assessment.tactical_score ?? '',
            physical_score:
                assessment.physical_score ?? '',
            discipline_score:
                assessment.discipline_score ?? '',
            overall_score:
                assessment.overall_score ?? '',
            strengths: assessment.strengths || '',
            areas_to_improve:
                assessment.areas_to_improve || '',
            notes: assessment.notes || '',
        });

        setError('');
        setSuccess('');

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleDelete = async (assessment) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this assessment?'
        );

        if (!confirmed) {
            return;
        }

        try {
            setError('');
            setSuccess('');

            await api.delete(
                `/coach/assessments/${assessment.id}`
            );

            setAssessments((current) =>
                current.filter(
                    (item) => item.id !== assessment.id
                )
            );

            if (editingId === assessment.id) {
                resetForm();
            }

            setSuccess(
                'Assessment deleted successfully.'
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to delete assessment.'
            );
        }
    };

    if (loading) {
        return (
            <div className="coach-assessments-page">
                <div className="coach-assessments-loading">
                    Loading assessments...
                </div>
            </div>
        );
    }

    return (
        <div className="coach-assessments-page">
            <div className="coach-assessments-header">
                <div>
                    <span className="coach-assessments-eyebrow">
                        COACH PORTAL
                    </span>

                    <h1>Player Assessments</h1>

                    <p>
                        Evaluate only the players assigned to
                        your coaching profile.
                    </p>
                </div>
            </div>

            {error && (
                <div className="coach-assessments-message error">
                    {error}
                </div>
            )}

            {success && (
                <div className="coach-assessments-message success">
                    {success}
                </div>
            )}

            <div className="coach-assessments-form-card">
                <div className="coach-assessments-card-header">
                    <h2>
                        {editingId
                            ? 'Edit Assessment'
                            : 'New Assessment'}
                    </h2>

                    {editingId && (
                        <button
                            type="button"
                            className="coach-assessments-cancel"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>
                    )}
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="coach-assessments-form"
                >
                    <div className="coach-assessments-grid">
                        <div className="coach-assessments-field">
                            <label>Player</label>

                            <select
                                name="player_id"
                                value={form.player_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select Player
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

                        <div className="coach-assessments-field">
                            <label>Training Session</label>

                            <select
                                name="training_session_id"
                                value={
                                    form.training_session_id
                                }
                                onChange={handleChange}
                            >
                                <option value="">
                                    No Session
                                </option>

                                {trainingSessions.map(
                                    (session) => (
                                        <option
                                            key={session.id}
                                            value={session.id}
                                        >
                                            {session.title} —{' '}
                                            {session.session_date}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="coach-assessments-field">
                            <label>Assessment Date</label>

                            <input
                                type="date"
                                name="assessment_date"
                                value={form.assessment_date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {[
                            ['technical_score', 'Technical Score'],
                            ['tactical_score', 'Tactical Score'],
                            ['physical_score', 'Physical Score'],
                            ['discipline_score', 'Discipline Score'],
                            ['overall_score', 'Overall Score'],
                        ].map(([name, label]) => (
                            <div
                                className="coach-assessments-field"
                                key={name}
                            >
                                <label>{label}</label>

                                <input
                                    type="number"
                                    name={name}
                                    min="1"
                                    max="10"
                                    value={form[name]}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}

                        <div className="coach-assessments-field coach-assessments-full">
                            <label>Strengths</label>

                            <textarea
                                name="strengths"
                                rows="3"
                                value={form.strengths}
                                onChange={handleChange}
                                placeholder="Player strengths"
                            />
                        </div>

                        <div className="coach-assessments-field coach-assessments-full">
                            <label>Areas To Improve</label>

                            <textarea
                                name="areas_to_improve"
                                rows="3"
                                value={form.areas_to_improve}
                                onChange={handleChange}
                                placeholder="Areas that need development"
                            />
                        </div>

                        <div className="coach-assessments-field coach-assessments-full">
                            <label>Notes</label>

                            <textarea
                                name="notes"
                                rows="3"
                                value={form.notes}
                                onChange={handleChange}
                                placeholder="Additional notes"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="coach-assessments-save"
                        disabled={saving}
                    >
                        {saving
                            ? 'Saving...'
                            : editingId
                            ? 'Update Assessment'
                            : 'Create Assessment'}
                    </button>
                </form>
            </div>

            <div className="coach-assessments-table-card">
                <div className="coach-assessments-card-header">
                    <h2>My Assessments</h2>

                    <span className="coach-assessments-count">
                        {assessments.length}
                    </span>
                </div>

                {assessments.length === 0 ? (
                    <div className="coach-assessments-empty">
                        No assessments found.
                    </div>
                ) : (
                    <div className="coach-assessments-table-wrapper">
                        <table className="coach-assessments-table">
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Date</th>
                                    <th>Overall</th>
                                    <th>Strengths</th>
                                    <th>Areas To Improve</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {assessments.map(
                                    (assessment) => (
                                        <tr key={assessment.id}>
                                            <td>
                                                <strong>
                                                    {assessment.player
                                                        ?.first_name}{' '}
                                                    {assessment.player
                                                        ?.last_name}
                                                </strong>
                                            </td>

                                            <td>
                                                {assessment.assessment_date ||
                                                    '-'}
                                            </td>

                                            <td>
                                                <span className="coach-assessment-score">
                                                    {assessment.overall_score ??
                                                        '-'}
                                                </span>
                                            </td>

                                            <td>
                                                {assessment.strengths ||
                                                    '-'}
                                            </td>

                                            <td>
                                                {assessment.areas_to_improve ||
                                                    '-'}
                                            </td>

                                            <td>
                                                <div className="coach-assessment-actions">
                                                    <button
                                                        type="button"
                                                        className="coach-assessment-edit"
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
                                                        className="coach-assessment-delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                assessment
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