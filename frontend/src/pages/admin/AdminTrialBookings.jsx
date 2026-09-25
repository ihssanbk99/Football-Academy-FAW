import { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminTrialBookings.css';

function AdminTrialBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectNote, setRejectNote] = useState('');

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/trial-bookings');
            setBookings(response.data.trial_bookings || []);
            setError('');
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to load trial bookings.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleApprove = async (id) => {
        try {
            setActionLoading(id);
            await api.patch(`/admin/trial-bookings/${id}/approve`, {
                admin_notes: '',
            });
            await fetchBookings();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to approve trial booking.'
            );
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id) => {
        if (!rejectNote.trim()) {
            setError('Please enter a rejection reason.');
            return;
        }

        try {
            setActionLoading(id);

            await api.patch(`/admin/trial-bookings/${id}/reject`, {
                admin_notes: rejectNote,
            });

            setRejectingId(null);
            setRejectNote('');
            await fetchBookings();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to reject trial booking.'
            );
        } finally {
            setActionLoading(null);
        }
    };

    const handleRegisterPlayer = async (id) => {
        try {
            setActionLoading(id);

            await api.post(
                `/admin/trial-bookings/${id}/register-player`
            );

            await fetchBookings();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to register player.'
            );
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return '-';
        }

        return new Date(date).toLocaleDateString();
    };

    const formatTime = (time) => {
        if (!time) {
            return '-';
        }

        return time.slice(0, 5);
    };

    return (
        <div className="admin-trial-page">
            <div className="admin-trial-header">
                <div>
                    <span>FAW ACADEMY</span>
                    <h1>Trial Bookings</h1>
                    <p>
                        Review trial requests and register approved players.
                    </p>
                </div>

                <div className="admin-trial-count">
                    {bookings.length} Requests
                </div>
            </div>

            {error && (
                <div className="admin-trial-error">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="admin-trial-card admin-trial-empty">
                    Loading trial bookings...
                </div>
            ) : bookings.length === 0 ? (
                <div className="admin-trial-card admin-trial-empty">
                    No trial bookings found.
                </div>
            ) : (
                <div className="admin-trial-list">
                    {bookings.map((booking) => (
                        <div
                            className="admin-trial-card"
                            key={booking.id}
                        >
                            <div className="admin-trial-top">
                                <div>
                                    <span className="admin-trial-label">
                                        PLAYER
                                    </span>

                                    <h2>
                                        {booking.first_name}{' '}
                                        {booking.last_name}
                                    </h2>
                                </div>

                                <span
                                    className={`admin-trial-status ${booking.status}`}
                                >
                                    {booking.status}
                                </span>
                            </div>

                            <div className="admin-trial-info">
                                <div>
                                    <span>Date of Birth</span>
                                    <strong>
                                        {formatDate(
                                            booking.date_of_birth
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Position</span>
                                    <strong>
                                        {booking.position || '-'}
                                    </strong>
                                </div>

                                <div>
                                    <span>Age Group</span>
                                    <strong>
                                        {booking.age_group?.name || '-'}
                                    </strong>
                                </div>

                                <div>
                                    <span>Branch</span>
                                    <strong>
                                        {booking.branch?.name || '-'}
                                    </strong>
                                </div>

                                <div>
                                    <span>Parent</span>
                                    <strong>
                                        {booking.parent?.name || '-'}
                                    </strong>
                                </div>

                                <div>
                                    <span>Parent Email</span>
                                    <strong>
                                        {booking.parent?.email || '-'}
                                    </strong>
                                </div>

                                <div>
                                    <span>Phone</span>
                                    <strong>
                                        {booking.phone || '-'}
                                    </strong>
                                </div>

                                <div>
                                    <span>Training Session</span>
                                    <strong>
                                        {booking.training_session?.title ||
                                            '-'}
                                    </strong>
                                </div>

                                {booking.training_session && (
                                    <div>
                                        <span>Session Time</span>
                                        <strong>
                                            {formatDate(
                                                booking.training_session
                                                    .session_date
                                            )}{' '}
                                            ·{' '}
                                            {formatTime(
                                                booking.training_session
                                                    .start_time
                                            )}
                                        </strong>
                                    </div>
                                )}
                            </div>

                            {booking.notes && (
                                <div className="admin-trial-notes">
                                    <span>Parent Notes</span>
                                    <p>{booking.notes}</p>
                                </div>
                            )}

                            {booking.admin_notes && (
                                <div className="admin-trial-admin-notes">
                                    <span>Admin Notes</span>
                                    <p>{booking.admin_notes}</p>
                                </div>
                            )}

                            {booking.status === 'pending' && (
                                <div className="admin-trial-actions">
                                    <button
                                        type="button"
                                        className="admin-trial-approve"
                                        disabled={
                                            actionLoading === booking.id
                                        }
                                        onClick={() =>
                                            handleApprove(booking.id)
                                        }
                                    >
                                        {actionLoading === booking.id
                                            ? 'Processing...'
                                            : 'Approve'}
                                    </button>

                                    <button
                                        type="button"
                                        className="admin-trial-reject"
                                        disabled={
                                            actionLoading === booking.id
                                        }
                                        onClick={() => {
                                            setRejectingId(booking.id);
                                            setRejectNote('');
                                            setError('');
                                        }}
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}

                            {booking.status === 'approved' && (
                                <div className="admin-trial-actions">
                                    <button
                                        type="button"
                                        className="admin-trial-register"
                                        disabled={
                                            actionLoading === booking.id
                                        }
                                        onClick={() =>
                                            handleRegisterPlayer(
                                                booking.id
                                            )
                                        }
                                    >
                                        {actionLoading === booking.id
                                            ? 'Registering...'
                                            : 'Register Player'}
                                    </button>
                                </div>
                            )}

                            {rejectingId === booking.id && (
                                <div className="admin-trial-reject-box">
                                    <label>
                                        Rejection Reason
                                        <textarea
                                            value={rejectNote}
                                            onChange={(event) =>
                                                setRejectNote(
                                                    event.target.value
                                                )
                                            }
                                            rows="3"
                                            placeholder="Enter the reason for rejecting this request"
                                        />
                                    </label>

                                    <div>
                                        <button
                                            type="button"
                                            className="admin-trial-confirm-reject"
                                            disabled={
                                                actionLoading ===
                                                booking.id
                                            }
                                            onClick={() =>
                                                handleReject(
                                                    booking.id
                                                )
                                            }
                                        >
                                            Confirm Rejection
                                        </button>

                                        <button
                                            type="button"
                                            className="admin-trial-cancel"
                                            onClick={() => {
                                                setRejectingId(null);
                                                setRejectNote('');
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminTrialBookings;