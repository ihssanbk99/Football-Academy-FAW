import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [data, setData] = useState({
        stats: {},
        recent_players: [],
        upcoming_sessions: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDashboard = async () => {
        try {
            const response = await api.get('/admin/dashboard');
            setData(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load dashboard.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const stats = data.stats || {};

    const formatDate = (date) => {
        if (!date) {
            return 'Not available';
        }

        return new Date(date).toLocaleDateString('en-US', {
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

    if (loading) {
        return (
            <div className="admin-dashboard-state">
                <div className="admin-dashboard-spinner"></div>
                <h2>Loading dashboard...</h2>
                <p>Preparing your academy overview.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-dashboard-state">
                <div className="admin-dashboard-state-icon">!</div>
                <h2>Unable to load dashboard</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-page">
            <section className="admin-dashboard-welcome">
                <div>
                    <span>FAW FOOTBALL ACADEMY</span>
                    <h1>Admin Dashboard</h1>
                    <p>
                        Your academy overview, activity, and upcoming
                        training schedule.
                    </p>
                </div>

                <div className="admin-dashboard-ball">⚽</div>
            </section>

            <section className="admin-dashboard-stats">
                <Link
                    to="/admin/players"
                    className="admin-dashboard-stat-card"
                >
                    <div className="admin-dashboard-stat-icon">⚽</div>
                    <span>PLAYERS</span>
                    <strong>{stats.players || 0}</strong>
                    <small>
                        {stats.active_players || 0} active players
                    </small>
                </Link>

                <Link
                    to="/admin/parents"
                    className="admin-dashboard-stat-card"
                >
                    <div className="admin-dashboard-stat-icon">◉</div>
                    <span>PARENTS</span>
                    <strong>{stats.parents || 0}</strong>
                    <small>Registered parents</small>
                </Link>

                <Link
                    to="/admin/coaches"
                    className="admin-dashboard-stat-card"
                >
                    <div className="admin-dashboard-stat-icon">★</div>
                    <span>COACHES</span>
                    <strong>{stats.coaches || 0}</strong>
                    <small>Coaching staff</small>
                </Link>

                <Link
                    to="/admin/age-groups"
                    className="admin-dashboard-stat-card"
                >
                    <div className="admin-dashboard-stat-icon">◫</div>
                    <span>AGE GROUPS</span>
                    <strong>{stats.age_groups || 0}</strong>
                    <small>Active groups</small>
                </Link>

                <Link
                    to="/admin/training"
                    className="admin-dashboard-stat-card"
                >
                    <div className="admin-dashboard-stat-icon">▣</div>
                    <span>TRAINING</span>
                    <strong>{stats.training_sessions || 0}</strong>
                    <small>Active sessions</small>
                </Link>

                <Link
                    to="/admin/payments"
                    className="admin-dashboard-stat-card"
                >
                    <div className="admin-dashboard-stat-icon">$</div>
                    <span>PENDING</span>
                    <strong>{stats.pending_payments || 0}</strong>
                    <small>Payments awaiting</small>
                </Link>
            </section>

            <section className="admin-dashboard-finance">
                <div>
                    <span>PAID REVENUE</span>
                    <strong>
                        {Number(stats.paid_amount || 0).toFixed(2)} JOD
                    </strong>
                </div>

                <div>
                    <span>UNREAD NOTIFICATIONS</span>
                    <strong>{stats.unread_notifications || 0}</strong>
                </div>

                <Link to="/admin/payments">
                    View Payments
                </Link>

                <Link to="/admin/notifications">
                    View Notifications
                </Link>
            </section>

            <section className="admin-dashboard-columns">
                <div className="admin-dashboard-panel">
                    <div className="admin-dashboard-panel-header">
                        <div>
                            <span>RECENT ACTIVITY</span>
                            <h2>Recent Players</h2>
                        </div>

                        <Link to="/admin/players">
                            View All
                        </Link>
                    </div>

                    {data.recent_players.length === 0 ? (
                        <div className="admin-dashboard-empty">
                            No players available.
                        </div>
                    ) : (
                        <div className="admin-dashboard-player-list">
                            {data.recent_players.map((player) => (
                                <div
                                    className="admin-dashboard-player"
                                    key={player.id}
                                >
                                    <div className="admin-dashboard-player-avatar">
                                        {player.first_name
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </div>

                                    <div>
                                        <strong>
                                            {player.first_name}{' '}
                                            {player.last_name}
                                        </strong>

                                        <span>
                                            Parent:{' '}
                                            {player.parent?.name ||
                                                'Unknown'}
                                        </span>
                                    </div>

                                    <div className="admin-dashboard-player-meta">
                                        <strong>
                                            {player.age_group?.name ||
                                                'No group'}
                                        </strong>

                                        <span>
                                            {player.registration_status ||
                                                'pending'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="admin-dashboard-panel">
                    <div className="admin-dashboard-panel-header">
                        <div>
                            <span>UPCOMING SCHEDULE</span>
                            <h2>Training Sessions</h2>
                        </div>

                        <Link to="/admin/training">
                            View All
                        </Link>
                    </div>

                    {data.upcoming_sessions.length === 0 ? (
                        <div className="admin-dashboard-empty">
                            No upcoming training sessions.
                        </div>
                    ) : (
                        <div className="admin-dashboard-session-list">
                            {data.upcoming_sessions.map((session) => (
                                <div
                                    className="admin-dashboard-session"
                                    key={session.id}
                                >
                                    <div className="admin-dashboard-session-date">
                                        <strong>
                                            {new Date(
                                                session.session_date
                                            ).getDate()}
                                        </strong>

                                        <span>
                                            {new Date(
                                                session.session_date
                                            ).toLocaleDateString('en-US', {
                                                month: 'short',
                                            })}
                                        </span>
                                    </div>

                                    <div className="admin-dashboard-session-info">
                                        <strong>{session.title}</strong>

                                        <span>
                                            {session.age_group?.name ||
                                                'No group'}{' '}
                                            ·{' '}
                                            {session.coach?.full_name ||
                                                'No coach'}
                                        </span>

                                        <small>
                                            {formatTime(
                                                session.start_time
                                            )}{' '}
                                            —{' '}
                                            {formatTime(
                                                session.end_time
                                            )}
                                        </small>
                                    </div>

                                    <span className="admin-dashboard-session-day">
                                        {formatDate(
                                            session.session_date
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="admin-dashboard-quick-links">
                <div>
                    <span>QUICK ACTIONS</span>
                    <h2>Academy Management</h2>
                </div>

                <Link to="/admin/players">
                    Manage Players
                </Link>

                <Link to="/admin/coaches">
                    Manage Coaches
                </Link>

                <Link to="/admin/training">
                    Manage Training
                </Link>

                <Link to="/admin/payments">
                    Manage Payments
                </Link>

                <Link to="/admin/notifications">
                    Send Notification
                </Link>
            </section>
        </div>
    );
}