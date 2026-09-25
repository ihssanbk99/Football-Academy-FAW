import { useEffect, useState } from 'react';
import api from '../../services/api';
import './ParentNotifications.css';

export default function ParentNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications');
            setNotifications(response.data.notifications || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load notifications.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            const response = await api.patch(
                `/notifications/${notificationId}/read`
            );

            const updatedNotification = response.data.notification;

            setNotifications((currentNotifications) =>
                currentNotifications.map((notification) =>
                    notification.id === updatedNotification.id
                        ? updatedNotification
                        : notification
                )
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to update notification.'
            );
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch('/notifications/read-all');

            setNotifications((currentNotifications) =>
                currentNotifications.map((notification) => ({
                    ...notification,
                    is_read: true,
                    read_at: new Date().toISOString(),
                }))
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to mark notifications as read.'
            );
        }
    };

    const unreadCount = notifications.filter(
        (notification) => !notification.is_read
    ).length;

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

    const formatType = (type) => {
        if (!type) {
            return 'General';
        }

        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    return (
        <div className="parent-notifications-page">
            <section className="parent-notifications-hero">
                <div>
                    <span>ACADEMY UPDATES</span>

                    <h1>Notifications</h1>

                    <p>
                        Stay informed about training, payments and important
                        academy updates.
                    </p>
                </div>

                <div className="parent-notifications-bell">
                    ◌
                    {unreadCount > 0 && (
                        <strong>{unreadCount}</strong>
                    )}
                </div>
            </section>

            <section className="parent-notifications-toolbar">
                <div>
                    <span>NOTIFICATIONS</span>
                    <strong>{notifications.length}</strong>
                </div>

                <div>
                    <span>UNREAD</span>
                    <strong>{unreadCount}</strong>
                </div>

                {unreadCount > 0 && (
                    <button
                        type="button"
                        onClick={markAllAsRead}
                        className="parent-notifications-read-all"
                    >
                        Mark All as Read
                    </button>
                )}
            </section>

            {loading && (
                <div className="parent-notifications-state">
                    <div className="parent-notifications-spinner"></div>

                    <h2>Loading notifications...</h2>

                    <p>
                        Please wait while we load your academy updates.
                    </p>
                </div>
            )}

            {!loading && error && (
                <div className="parent-notifications-state">
                    <div className="parent-notifications-state-icon">!</div>

                    <h2>Unable to load notifications</h2>

                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && notifications.length === 0 && (
                <div className="parent-notifications-state">
                    <div className="parent-notifications-state-icon">◌</div>

                    <h2>No notifications yet</h2>

                    <p>
                        You are all caught up. New academy updates will appear
                        here.
                    </p>
                </div>
            )}

            {!loading && !error && notifications.length > 0 && (
                <section className="parent-notifications-list">
                    {notifications.map((notification) => (
                        <article
                            key={notification.id}
                            className={`parent-notification-card ${
                                notification.is_read ? 'read' : 'unread'
                            }`}
                        >
                            <div className="parent-notification-icon">
                                {notification.type === 'training'
                                    ? '⚽'
                                    : notification.type === 'payment'
                                      ? '$'
                                      : '◌'}
                            </div>

                            <div className="parent-notification-content">
                                <div className="parent-notification-top">
                                    <div>
                                        <span>
                                            {formatType(notification.type)}
                                        </span>

                                        <h2>{notification.title}</h2>
                                    </div>

                                    {!notification.is_read && (
                                        <span className="parent-notification-new">
                                            NEW
                                        </span>
                                    )}
                                </div>

                                <p>{notification.message}</p>

                                <div className="parent-notification-bottom">
                                    <span>
                                        {formatDate(notification.created_at)}
                                    </span>

                                    {!notification.is_read && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                markAsRead(notification.id)
                                            }
                                        >
                                            Mark as Read
                                            <span>✓</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </div>
    );
}