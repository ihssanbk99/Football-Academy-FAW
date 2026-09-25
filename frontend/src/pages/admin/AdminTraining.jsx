import { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminTraining.css';

export default function AdminTraining() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSessions = async () => {
        try {
            const response = await api.get('/admin/training');
            setSessions(response.data.training_sessions || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load training sessions.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const activeSessions = sessions.filter(
        (session) => session.is_active
    ).length;

    const sessionTypes = new Set(
        sessions.map((session) => session.training_type)
    ).size;

    const formatDate = (date) => {
        if (!date) {
            return 'Not available';
        }

        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatTime = (time) => {
        if (!time) {
            return 'Not available';
        }

        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(Number(hours), Number(minutes), 0);

        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const getTypeLabel = (type) => {
        if (!type) {
            return 'Regular';
        }

        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    return (
        <div className="admin-training-page">
            <section className="admin-training-hero">
                <div>
                    <span>ACADEMY SCHEDULE</span>
                    <h1>Training</h1>
                    <p>
                        Manage academy training sessions, coaches, fields,
                        and age groups.
                    </p>
                </div>

                <div className="admin-training-hero-icon">▣</div>
            </section>

            <section className="admin-training-summary">
                <div className="admin-training-summary-card">
                    <span>TOTAL SESSIONS</span>
                    <strong>{sessions.length}</strong>
                </div>

                <div className="admin-training-summary-card">
                    <span>ACTIVE SESSIONS</span>
                    <strong>{activeSessions}</strong>
                </div>

                <div className="admin-training-summary-card">
                    <span>TRAINING TYPES</span>
                    <strong>{sessionTypes}</strong>
                </div>
            </section>

            {loading && (
                <div className="admin-training-state">
                    <div className="admin-training-spinner"></div>
                    <h2>Loading training sessions...</h2>
                    <p>
                        Please wait while we load the academy schedule.
                    </p>
                </div>
            )}

            {!loading && error && (
                <div className="admin-training-state">
                    <div className="admin-training-state-icon">!</div>
                    <h2>Unable to load training</h2>
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && sessions.length === 0 && (
                <div className="admin-training-state">
                    <div className="admin-training-state-icon">▣</div>
                    <h2>No training sessions yet</h2>
                    <p>
                        Academy training sessions will appear here once they
                        are scheduled.
                    </p>
                </div>
            )}

            {!loading && !error && sessions.length > 0 && (
                <section className="admin-training-list-section">
                    <div className="admin-training-list-header">
                        <div>
                            <span>TRAINING CALENDAR</span>
                            <h2>Scheduled Sessions</h2>
                        </div>

                        <span className="admin-training-count">
                            {sessions.length} Sessions
                        </span>
                    </div>

                    <div className="admin-training-list">
                        {sessions.map((session) => (
                            <article
                                className="admin-training-card"
                                key={session.id}
                            >
                                <div className="admin-training-date">
                                    <span>
                                        {new Date(
                                            session.session_date
                                        ).toLocaleDateString('en-US', {
                                            month: 'short',
                                        })}
                                    </span>

                                    <strong>
                                        {new Date(
                                            session.session_date
                                        ).getDate()}
                                    </strong>

                                    <small>
                                        {new Date(
                                            session.session_date
                                        ).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                        })}
                                    </small>
                                </div>

                                <div className="admin-training-main">
                                    <div className="admin-training-card-top">
                                        <div>
                                            <span className="admin-training-type">
                                                {getTypeLabel(
                                                    session.training_type
                                                )}
                                            </span>

                                            <h2>{session.title}</h2>
                                        </div>

                                        <span
                                            className={`admin-training-status ${
                                                session.is_active
                                                    ? 'active'
                                                    : 'inactive'
                                            }`}
                                        >
                                            {session.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </span>
                                    </div>

                                    <div className="admin-training-details">
                                        <div>
                                            <span>TIME</span>
                                            <strong>
                                                {formatTime(
                                                    session.start_time
                                                )}{' '}
                                                —{' '}
                                                {formatTime(
                                                    session.end_time
                                                )}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>AGE GROUP</span>
                                            <strong>
                                                {session.age_group?.name ||
                                                    'Not assigned'}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>COACH</span>
                                            <strong>
                                                {session.coach?.full_name ||
                                                    'Not assigned'}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>FIELD</span>
                                            <strong>
                                                {session.field_name ||
                                                    'Not assigned'}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="admin-training-meta">
                                        <span>
                                            Academy:{' '}
                                            {session.academy?.name ||
                                                'Not assigned'}
                                        </span>

                                        <span>
                                            Branch:{' '}
                                            {session.branch?.name ||
                                                'Not assigned'}
                                        </span>

                                        <span>
                                            {formatDate(session.session_date)}
                                        </span>
                                    </div>

                                    {session.notes && (
                                        <p className="admin-training-notes">
                                            {session.notes}
                                        </p>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}