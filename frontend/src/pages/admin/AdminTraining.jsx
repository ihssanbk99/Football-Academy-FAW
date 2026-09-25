import { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminTraining.css';

const ACADEMY_ID = 1;

const emptyForm = {
    title: '',
    session_date: '',
    start_time: '',
    end_time: '',
    age_group_id: '',
    coach_id: '',
    field_name: '',
    training_type: 'regular',
    notes: '',
    is_active: true,
};

function AdminTraining() {
    const [sessions, setSessions] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [ageGroups, setAgeGroups] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);

            const [trainingResponse, coachesResponse, ageGroupsResponse] =
                await Promise.all([
                    api.get('/admin/training'),
                    api.get('/admin/coaches'),
                    api.get('/admin/age-groups'),
                ]);

            setSessions(trainingResponse.data.training_sessions || []);
            setCoaches(coachesResponse.data.coaches || []);
            setAgeGroups(ageGroupsResponse.data.age_groups || []);
            setError('');
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to load training data.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError('');

            const payload = {
                academy_id: ACADEMY_ID,
                branch_id: null,
                age_group_id: Number(form.age_group_id),
                coach_id: Number(form.coach_id),
                title: form.title,
                session_date: form.session_date,
                start_time: form.start_time,
                end_time: form.end_time,
                field_name: form.field_name || null,
                training_type: form.training_type,
                notes: form.notes || null,
                is_active: form.is_active,
            };

            if (editingId) {
                await api.patch(`/admin/training/${editingId}`, payload);
            } else {
                await api.post('/admin/training', payload);
            }

            resetForm();
            await fetchData();
        } catch (err) {
            const validationErrors = err.response?.data?.errors;

            if (validationErrors) {
                setError(Object.values(validationErrors).flat().join(' '));
            } else {
                setError(
                    err.response?.data?.message ||
                        'Unable to save training session.'
                );
            }
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (session) => {
        setEditingId(session.id);

        setForm({
            title: session.title || '',
            session_date: session.session_date
                ? session.session_date.slice(0, 10)
                : '',
            start_time: session.start_time
                ? session.start_time.slice(0, 5)
                : '',
            end_time: session.end_time
                ? session.end_time.slice(0, 5)
                : '',
            age_group_id: session.age_group_id || '',
            coach_id: session.coach_id || '',
            field_name: session.field_name || '',
            training_type: session.training_type || 'regular',
            notes: session.notes || '',
            is_active: Boolean(session.is_active),
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleToggle = async (session) => {
        try {
            setError('');

            await api.patch(`/admin/training/${session.id}`, {
                is_active: !session.is_active,
            });

            await fetchData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to update training status.'
            );
        }
    };

    const handleDelete = async (session) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${session.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError('');

            await api.delete(`/admin/training/${session.id}`);

            await fetchData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to delete training session.'
            );
        }
    };

    return (
        <div className="admin-training-page">
            <div className="admin-training-header">
                <div>
                    <h1>Training Sessions</h1>
                    <p>
                        Manage training times, coaches, age groups and
                        sessions.
                    </p>
                </div>
            </div>

            {error && (
                <div className="admin-training-error">
                    {error}
                </div>
            )}

            <div className="admin-training-form-card">
                <div className="admin-training-card-header">
                    <h2>
                        {editingId
                            ? 'Edit Training Session'
                            : 'Add Training Session'}
                    </h2>

                    {editingId && (
                        <button
                            type="button"
                            className="training-cancel-button"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>
                    )}
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="admin-training-form"
                >
                    <div className="training-form-grid">
                        <div className="training-form-group training-form-full">
                            <label>Session Title</label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="training-form-group">
                            <label>Date</label>
                            <input
                                type="date"
                                name="session_date"
                                value={form.session_date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="training-form-group">
                            <label>Age Group</label>
                            <select
                                name="age_group_id"
                                value={form.age_group_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select age group
                                </option>

                                {ageGroups.map((ageGroup) => (
                                    <option
                                        key={ageGroup.id}
                                        value={ageGroup.id}
                                    >
                                        {ageGroup.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="training-form-group">
                            <label>Start Time</label>
                            <input
                                type="time"
                                name="start_time"
                                value={form.start_time}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="training-form-group">
                            <label>End Time</label>
                            <input
                                type="time"
                                name="end_time"
                                value={form.end_time}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="training-form-group">
                            <label>Coach</label>
                            <select
                                name="coach_id"
                                value={form.coach_id}
                                onChange={handleChange}
                                required
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

                        <div className="training-form-group">
                            <label>Field</label>
                            <input
                                type="text"
                                name="field_name"
                                value={form.field_name}
                                onChange={handleChange}
                                placeholder="Main Field"
                            />
                        </div>

                        <div className="training-form-group">
                            <label>Training Type</label>
                            <select
                                name="training_type"
                                value={form.training_type}
                                onChange={handleChange}
                                required
                            >
                                <option value="regular">Regular</option>
                                <option value="fitness">Fitness</option>
                                <option value="technical">Technical</option>
                                <option value="tactical">Tactical</option>
                                <option value="match">Match</option>
                            </select>
                        </div>

                        <div className="training-form-group training-form-full">
                            <label>Notes</label>
                            <textarea
                                name="notes"
                                rows="4"
                                value={form.notes}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="training-form-checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={form.is_active}
                                    onChange={handleChange}
                                />
                                Active Session
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="training-save-button"
                        disabled={saving}
                    >
                        {saving
                            ? 'Saving...'
                            : editingId
                            ? 'Update Session'
                            : 'Add Session'}
                    </button>
                </form>
            </div>

            <div className="admin-training-table-card">
                <div className="admin-training-card-header">
                    <h2>All Training Sessions</h2>
                    <span className="training-count">
                        {sessions.length}
                    </span>
                </div>

                {loading ? (
                    <div className="training-loading">
                        Loading training sessions...
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="training-empty">
                        No training sessions found.
                    </div>
                ) : (
                    <div className="training-table-wrapper">
                        <table className="training-table">
                            <thead>
                                <tr>
                                    <th>Session</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Age Group</th>
                                    <th>Coach</th>
                                    <th>Type</th>
                                    <th>Field</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {sessions.map((session) => (
                                    <tr key={session.id}>
                                        <td>
                                            <div className="training-title">
                                                {session.title}
                                            </div>

                                            {session.notes && (
                                                <div className="training-notes">
                                                    {session.notes}
                                                </div>
                                            )}
                                        </td>

                                        <td>
                                            {session.session_date
                                                ? new Date(
                                                      `${session.session_date.slice(
                                                          0,
                                                          10
                                                      )}T00:00:00`
                                                  ).toLocaleDateString()
                                                : '-'}
                                        </td>

                                        <td>
                                            {session.start_time?.slice(
                                                0,
                                                5
                                            )}{' '}
                                            -{' '}
                                            {session.end_time?.slice(
                                                0,
                                                5
                                            )}
                                        </td>

                                        <td>
                                            {session.age_group?.name || '-'}
                                        </td>

                                        <td>
                                            {session.coach?.full_name || '-'}
                                        </td>

                                        <td>
                                            <span className="training-type">
                                                {session.training_type}
                                            </span>
                                        </td>

                                        <td>
                                            {session.field_name || '-'}
                                        </td>

                                        <td>
                                            <span
                                                className={`training-status ${
                                                    session.is_active
                                                        ? 'active'
                                                        : 'inactive'
                                                }`}
                                            >
                                                {session.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="training-actions">
                                                <button
                                                    type="button"
                                                    className="training-edit-button"
                                                    onClick={() =>
                                                        handleEdit(session)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="training-toggle-button"
                                                    onClick={() =>
                                                        handleToggle(session)
                                                    }
                                                >
                                                    {session.is_active
                                                        ? 'Deactivate'
                                                        : 'Activate'}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="training-delete-button"
                                                    onClick={() =>
                                                        handleDelete(session)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
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

export default AdminTraining;