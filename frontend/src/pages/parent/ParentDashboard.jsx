import { useEffect, useState } from 'react';
import api from '../../services/api';
import './ParentDashboard.css';

function ParentDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const response = await api.get('/parent/dashboard');
            setDashboard(response.data);
            setError('');
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to load your dashboard.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const formatDate = (date) => {
        if (!date) {
            return '-';
        }

        return new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString(
            undefined,
            {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            }
        );
    };

    const formatTime = (time) => {
        if (!time) {
            return '-';
        }

        return time.slice(0, 5);
    };

    if (loading) {
        return (
            <div className="parent-dashboard-page">
                <div className="parent-dashboard-loading">
                    Loading your dashboard...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="parent-dashboard-page">
                <div className="parent-dashboard-error">
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={fetchDashboard}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const stats = dashboard?.stats || {};
    const players = dashboard?.players || [];
    const sessions = dashboard?.training_sessions || [];
    const payments = dashboard?.payments || [];
    const notifications = dashboard?.notifications || [];
    const offers = dashboard?.offers || [];

    return (
        <div className="parent-dashboard-page">
            <section className="parent-dashboard-hero">
                <div className="parent-dashboard-hero-content">
                    <span className="parent-dashboard-eyebrow">
                        FAW ACADEMY
                    </span>

                    <h1>
                        Welcome back,{' '}
                        <strong>
                            {dashboard?.user?.name || 'Parent'}
                        </strong>
                    </h1>

                    <p>
                        Manage your players, training, payments and
                        academy updates from one place.
                    </p>
                </div>
            </section>

            <div className="parent-stats-grid">
                <div className="parent-stat-card">
                    <div className="parent-stat-icon">⚽</div>
                    <div>
                        <span>My Players</span>
                        <strong>{stats.players || 0}</strong>
                        <small>Registered players</small>
                    </div>
                </div>

                <div className="parent-stat-card">
                    <div className="parent-stat-icon">✓</div>
                    <div>
                        <span>Active Players</span>
                        <strong>{stats.active_players || 0}</strong>
                        <small>Currently active</small>
                    </div>
                </div>

                <div className="parent-stat-card">
                    <div className="parent-stat-icon">▣</div>
                    <div>
                        <span>Upcoming Training</span>
                        <strong>{sessions.length}</strong>
                        <small>Upcoming sessions</small>
                    </div>
                </div>

                <div className="parent-stat-card">
                    <div className="parent-stat-icon">◌</div>
                    <div>
                        <span>Notifications</span>
                        <strong>{stats.unread_notifications || 0}</strong>
                        <small>Unread updates</small>
                    </div>
                </div>
            </div>

            <div className="parent-dashboard-main-grid">
                <section className="parent-dashboard-section">
                    <div className="parent-section-header">
                        <div>
                            <span className="parent-section-eyebrow">
                                FAMILY
                            </span>
                            <h2>My Players</h2>
                            <p>Your registered academy players</p>
                        </div>
                    </div>

                    {players.length === 0 ? (
                        <div className="parent-empty-state">
                            No players registered yet.
                        </div>
                    ) : (
                        <div className="parent-players-grid">
                            {players.map((player) => (
                                <div
                                    className="parent-player-card"
                                    key={player.id}
                                >
                                    <div className="parent-player-avatar">
                                        {player.first_name?.charAt(0)}
                                        {player.last_name?.charAt(0)}
                                    </div>

                                    <div className="parent-player-info">
                                        <h3>
                                            {player.first_name}{' '}
                                            {player.last_name}
                                        </h3>

                                        <div className="parent-player-detail">
                                            <span>Age Group</span>
                                            <strong>
                                                {player.age_group?.name ||
                                                    'Not assigned'}
                                            </strong>
                                        </div>

                                        <div className="parent-player-detail">
                                            <span>Position</span>
                                            <strong>
                                                {player.position
                                                    ? player.position
                                                    : 'Not assigned'}
                                            </strong>
                                        </div>

                                        <span
                                            className={`parent-player-status ${player.registration_status}`}
                                        >
                                            {player.registration_status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="parent-dashboard-section">
                    <div className="parent-section-header">
                        <div>
                            <span className="parent-section-eyebrow">
                                SCHEDULE
                            </span>
                            <h2>Upcoming Training</h2>
                            <p>Next academy sessions</p>
                        </div>
                    </div>

                    {sessions.length === 0 ? (
                        <div className="parent-empty-state">
                            No upcoming training sessions.
                        </div>
                    ) : (
                        <div className="parent-training-list">
                            {sessions.map((session) => (
                                <div
                                    className="parent-training-item"
                                    key={session.id}
                                >
                                    <div className="parent-training-date">
                                        <strong>
                                            {new Date(
                                                `${session.session_date.slice(
                                                    0,
                                                    10
                                                )}T00:00:00`
                                            ).toLocaleDateString(undefined, {
                                                day: 'numeric',
                                            })}
                                        </strong>

                                        <span>
                                            {new Date(
                                                `${session.session_date.slice(
                                                    0,
                                                    10
                                                )}T00:00:00`
                                            ).toLocaleDateString(undefined, {
                                                month: 'short',
                                            })}
                                        </span>
                                    </div>

                                    <div className="parent-training-info">
                                        <h3>{session.title}</h3>

                                        <p>
                                            {session.coach?.full_name ||
                                                'Coach not assigned'}
                                        </p>

                                        <span>
                                            {formatTime(session.start_time)} -{' '}
                                            {formatTime(session.end_time)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <div className="parent-dashboard-bottom-grid">
                <section className="parent-dashboard-section">
                    <div className="parent-section-header">
                        <div>
                            <span className="parent-section-eyebrow">
                                FINANCE
                            </span>
                            <h2>Recent Payments</h2>
                            <p>Your latest payment activity</p>
                        </div>
                    </div>

                    {payments.length === 0 ? (
                        <div className="parent-empty-state">
                            No payment records found.
                        </div>
                    ) : (
                        <div className="parent-payment-list">
                            {payments.map((payment) => (
                                <div
                                    className="parent-payment-item"
                                    key={payment.id}
                                >
                                    <div className="parent-payment-main">
                                        <strong>
                                            {payment.payment_reference ||
                                                `Payment #${payment.id}`}
                                        </strong>

                                        <span>
                                            {payment.created_at
                                                ? formatDate(
                                                      payment.created_at
                                                  )
                                                : '-'}
                                        </span>
                                    </div>

                                    <div className="parent-payment-right">
                                        <strong>
                                            {payment.amount} JOD
                                        </strong>

                                        <span
                                            className={`parent-payment-status ${
                                                payment.status || 'pending'
                                            }`}
                                        >
                                            {payment.status || 'pending'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="parent-dashboard-section">
                    <div className="parent-section-header">
                        <div>
                            <span className="parent-section-eyebrow">
                                UPDATES
                            </span>
                            <h2>Notifications</h2>
                            <p>Latest academy updates</p>
                        </div>
                    </div>

                    {notifications.length === 0 ? (
                        <div className="parent-empty-state">
                            No notifications.
                        </div>
                    ) : (
                        <div className="parent-notification-list">
                            {notifications.map((notification) => (
                                <div
                                    className={`parent-notification-item ${
                                        notification.is_read
                                            ? ''
                                            : 'unread'
                                    }`}
                                    key={notification.id}
                                >
                                    <div className="parent-notification-dot" />

                                    <div className="parent-notification-content">
                                        <h3>{notification.title}</h3>
                                        <p>{notification.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <section className="parent-dashboard-section parent-offers-section">
                <div className="parent-section-header">
                    <div>
                        <span className="parent-section-eyebrow">
                            ACADEMY BENEFITS
                        </span>
                        <h2>Current Offers</h2>
                        <p>Available academy offers and discounts</p>
                    </div>
                </div>

                {offers.length === 0 ? (
                    <div className="parent-empty-state">
                        No active offers available.
                    </div>
                ) : (
                    <div className="parent-offers-grid">
                        {offers.map((offer) => (
                            <div
                                className="parent-offer-card"
                                key={offer.id}
                            >
                                <div className="parent-offer-discount">
                                    {Number(
                                        offer.discount_percentage
                                    ).toFixed(0)}
                                    %
                                </div>

                                <div className="parent-offer-content">
                                    <h3>{offer.title}</h3>

                                    {offer.subtitle && (
                                        <span>
                                            {offer.subtitle}
                                        </span>
                                    )}

                                    {offer.description && (
                                        <p>
                                            {offer.description}
                                        </p>
                                    )}

                                    {offer.code && (
                                        <div className="parent-offer-code">
                                            {offer.code}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default ParentDashboard;