import { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminCoaches.css';

const ACADEMY_ID = 1;

const emptyForm = {
    full_name: '',
    phone: '',
    specialization: '',
    experience_years: 0,
    bio: '',
    is_active: true,
};

function AdminCoaches() {
    const [coaches, setCoaches] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const fetchCoaches = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/coaches');
            setCoaches(response.data.coaches || []);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to load coaches.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoaches();
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
                full_name: form.full_name,
                phone: form.phone || null,
                specialization: form.specialization || null,
                experience_years: Number(form.experience_years) || 0,
                bio: form.bio || null,
                is_active: form.is_active,
            };

            if (editingId) {
                await api.patch(`/admin/coaches/${editingId}`, payload);
            } else {
                await api.post('/admin/coaches', payload);
            }

            resetForm();
            await fetchCoaches();
        } catch (err) {
            const validationErrors = err.response?.data?.errors;

            if (validationErrors) {
                setError(Object.values(validationErrors).flat().join(' '));
            } else {
                setError(err.response?.data?.message || 'Unable to save coach.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (coach) => {
        setEditingId(coach.id);
        setForm({
            full_name: coach.full_name || '',
            phone: coach.phone || '',
            specialization: coach.specialization || '',
            experience_years: coach.experience_years ?? 0,
            bio: coach.bio || '',
            is_active: Boolean(coach.is_active),
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleToggle = async (coach) => {
        try {
            setError('');

            await api.patch(`/admin/coaches/${coach.id}`, {
                is_active: !coach.is_active,
            });

            await fetchCoaches();
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to update coach status.');
        }
    };

    const handleDelete = async (coach) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${coach.full_name}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError('');
            await api.delete(`/admin/coaches/${coach.id}`);
            await fetchCoaches();
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to delete coach.');
        }
    };

    return (
        <div className="admin-coaches-page">
            <div className="admin-coaches-header">
                <div>
                    <h1>Coaches</h1>
                    <p>Manage academy coaches and their information.</p>
                </div>
            </div>

            {error && <div className="admin-coaches-error">{error}</div>}

            <div className="admin-coaches-form-card">
                <div className="admin-coaches-card-header">
                    <h2>{editingId ? 'Edit Coach' : 'Add Coach'}</h2>
                    {editingId && (
                        <button
                            type="button"
                            className="coach-cancel-button"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="admin-coaches-form">
                    <div className="coach-form-grid">
                        <div className="coach-form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="full_name"
                                value={form.full_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="coach-form-group">
                            <label>Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="coach-form-group">
                            <label>Specialization</label>
                            <input
                                type="text"
                                name="specialization"
                                value={form.specialization}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="coach-form-group">
                            <label>Experience Years</label>
                            <input
                                type="number"
                                name="experience_years"
                                min="0"
                                max="100"
                                value={form.experience_years}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="coach-form-group coach-form-full">
                            <label>Bio</label>
                            <textarea
                                name="bio"
                                rows="4"
                                value={form.bio}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="coach-form-checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={form.is_active}
                                    onChange={handleChange}
                                />
                                Active Coach
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="coach-save-button"
                        disabled={saving}
                    >
                        {saving
                            ? 'Saving...'
                            : editingId
                            ? 'Update Coach'
                            : 'Add Coach'}
                    </button>
                </form>
            </div>

            <div className="admin-coaches-table-card">
                <div className="admin-coaches-card-header">
                    <h2>All Coaches</h2>
                    <span className="coach-count">{coaches.length}</span>
                </div>

                {loading ? (
                    <div className="coach-loading">Loading coaches...</div>
                ) : coaches.length === 0 ? (
                    <div className="coach-empty">No coaches found.</div>
                ) : (
                    <div className="coach-table-wrapper">
                        <table className="coach-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Specialization</th>
                                    <th>Experience</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coaches.map((coach) => (
                                    <tr key={coach.id}>
                                        <td>
                                            <div className="coach-name">
                                                {coach.full_name}
                                            </div>
                                            {coach.user?.email && (
                                                <div className="coach-email">
                                                    {coach.user.email}
                                                </div>
                                            )}
                                        </td>

                                        <td>{coach.phone || '-'}</td>

                                        <td>
                                            {coach.specialization || '-'}
                                        </td>

                                        <td>
                                            {coach.experience_years} years
                                        </td>

                                        <td>
                                            <span
                                                className={`coach-status ${
                                                    coach.is_active
                                                        ? 'active'
                                                        : 'inactive'
                                                }`}
                                            >
                                                {coach.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="coach-actions">
                                                <button
                                                    type="button"
                                                    className="coach-edit-button"
                                                    onClick={() =>
                                                        handleEdit(coach)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="coach-toggle-button"
                                                    onClick={() =>
                                                        handleToggle(coach)
                                                    }
                                                >
                                                    {coach.is_active
                                                        ? 'Deactivate'
                                                        : 'Activate'}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="coach-delete-button"
                                                    onClick={() =>
                                                        handleDelete(coach)
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

export default AdminCoaches;