import { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminNotifications.css';

export default function AdminNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        user_id: '',
        title: '',
        message: '',
        type: 'general',
    });

    const fetchData = async () => {
        try {
            const [notificationsResponse, parentsResponse] = await Promise.all([
                api.get('/admin/notifications'),
                api.get('/admin/parents'),
            ]);

            setNotifications(
                notificationsResponse.data.notifications || []
            );

            setParents(
                parentsResponse.data.parents || []
            );
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
        fetchData();
    }, []);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const response = await api.post('/admin/notifications', form);

            setNotifications((current) => [
                response.data.notification,
                ...current,
            ]);

            setForm({
                user_id: '',
                title: '',
                message: '',
                type: 'general',
            });

            setShowForm(false);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to send notification.'
            );
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            await api.delete(`/admin/notifications/${notificationId}`);

            setNotifications((current) =>
                current.filter(
                    (notification) => notification.id !== notificationId
                )
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to delete notification.'
            );
        }
    };

    return (
        <div className="admin-notifications-page">
            <section className="admin-notifications-hero">
                <div>
                    <span>ACADEMY COMMUNICATION</span>
                    <h1>Notifications</h1>
                    <p>
                        Send important updates and manage academy
                        notifications for parents.
                    </p>
                </div>

                <div className="admin-notifications-icon">◌</div>
            </section>

            <section className="admin-notifications-toolbar">
                <div>
                    <span>TOTAL NOTIFICATIONS</span>
                    <strong>{notifications.length}</strong>
                </div>

                <button
                    type="button"
                    onClick={() => setShowForm((current) => !current)}
                >
                    {showForm ? 'Close Form' : 'Send Notification'}
                </button>
            </section>

            {showForm && (
                <form
                    className="admin-notifications-form"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label>Parent</label>
                        <select
                            name="user_id"
                            value={form.user_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select parent</option>

                            {parents.map((parent) => (
                                <option key={parent.id} value={parent.id}>
                                    {parent.name} — {parent.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Type</label>
                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                        >
                            <option value="general">General</option>
                            <option value="training">Training</option>
                            <option value="payment">Payment</option>
                            <option value="academy">Academy</option>
                        </select>
                    </div>

                    <div>
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Notification title"
                            required
                        />
                    </div>

                    <div>
                        <label>Message</label>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Write notification message"
                            rows="5"
                            required
                        ></textarea>
                    </div>

                    <button type="submit">
                        Send Notification
                    </button>
                </form>
            )}

            {error && (
                <div className="admin-notifications-error">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="admin-notifications-state">
                    <div className="admin-notifications-spinner"></div>
                    <h2>Loading notifications...</h2>
                </div>
            ) : notifications.length === 0 ? (
                <div className="admin-notifications-state">
                    <div className="admin-notifications-state-icon">◌</div>
                    <h2>No notifications yet</h2>
                    <p>
                        Notifications sent to parents will appear here.
                    </p>
                </div>
            ) : (
                <section className="admin-notifications-list">
                    {notifications.map((notification) => (
                        <article
                            className="admin-notification-card"
                            key={notification.id}
                        >
                            <div className="admin-notification-icon">
                                {notification.type === 'training'
                                    ? '⚽'
                                    : notification.type === 'payment'
                                      ? '$'
                                      : '◌'}
                            </div>

                            <div className="admin-notification-content">
                                <div className="admin-notification-top">
                                    <div>
                                        <span>
                                            {notification.type || 'general'}
                                        </span>
                                        <h2>{notification.title}</h2>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(notification.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>

                                <p>{notification.message}</p>

                                <div className="admin-notification-meta">
                                    <span>
                                        Parent:{' '}
                                        {notification.user?.name ||
                                            'Unknown'}
                                    </span>

                                    <span>
                                        {notification.user?.email || ''}
                                    </span>

                                    <span>
                                        {notification.is_read
                                            ? 'Read'
                                            : 'Unread'}
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </div>
    );
}