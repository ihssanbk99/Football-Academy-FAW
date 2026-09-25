import { useEffect, useState } from 'react';
import api from '../../services/api';
import './ParentTrialBooking.css';

function ParentTrialBooking() {
    const [form, setForm] = useState({
        academy_id: 1,
        branch_id: '',
        training_session_id: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        phone: '',
        position: '',
        notes: '',
    });

    const [branches, setBranches] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);

            const [bookingResponse, sessionResponse] = await Promise.all([
                api.get('/trial-bookings'),
                api.get('/training-sessions'),
            ]);

            setBookings(bookingResponse.data.trial_bookings || []);
            setSessions(sessionResponse.data.training_sessions || []);
            setBranches([]);
            setError('');
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to load trial booking data.'
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

        try {
            setSubmitting(true);
            setMessage('');
            setError('');

            await api.post('/trial-bookings', {
                ...form,
                branch_id: form.branch_id || null,
                training_session_id: form.training_session_id || null,
                position: form.position || null,
            });

            setMessage('Trial booking submitted successfully.');

            setForm({
                academy_id: 1,
                branch_id: '',
                training_session_id: '',
                first_name: '',
                last_name: '',
                date_of_birth: '',
                phone: '',
                position: '',
                notes: '',
            });

            fetchData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to submit trial booking.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="parent-trial-page">
            <div className="parent-trial-header">
                <span>FAW ACADEMY</span>
                <h1>Book a Trial</h1>
                <p>Give your child the opportunity to train with FAW Academy.</p>
            </div>

            <div className="parent-trial-grid">
                <section className="parent-trial-card">
                    <div className="parent-trial-card-header">
                        <span>NEW REQUEST</span>
                        <h2>Trial Booking</h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="parent-trial-form-grid">
                            <label>
                                First Name
                                <input
                                    name="first_name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label>
                                Last Name
                                <input
                                    name="last_name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label>
                                Date of Birth
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={form.date_of_birth}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label>
                                Phone
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                />
                            </label>

                            <label>
                                Position
                                <select
                                    name="position"
                                    value={form.position}
                                    onChange={handleChange}
                                >
                                    <option value="">Select position</option>
                                    <option value="goalkeeper">Goalkeeper</option>
                                    <option value="defender">Defender</option>
                                    <option value="midfielder">Midfielder</option>
                                    <option value="forward">Forward</option>
                                </select>
                            </label>

                            <label>
                                Training Session
                                <select
                                    name="training_session_id"
                                    value={form.training_session_id}
                                    onChange={handleChange}
                                >
                                    <option value="">Select session</option>
                                    {sessions.map((session) => (
                                        <option
                                            key={session.id}
                                            value={session.id}
                                        >
                                            {session.title} -{' '}
                                            {session.session_date?.slice(0, 10)}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <label>
                            Notes
                            <textarea
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                rows="4"
                            />
                        </label>

                        {message && (
                            <div className="parent-trial-success">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="parent-trial-error">
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Book Trial'}
                        </button>
                    </form>
                </section>

                <section className="parent-trial-card">
                    <div className="parent-trial-card-header">
                        <span>MY REQUESTS</span>
                        <h2>Trial Bookings</h2>
                    </div>

                    {loading ? (
                        <div className="parent-trial-empty">
                            Loading...
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="parent-trial-empty">
                            No trial bookings yet.
                        </div>
                    ) : (
                        <div className="parent-trial-bookings">
                            {bookings.map((booking) => (
                                <div
                                    className="parent-trial-booking"
                                    key={booking.id}
                                >
                                    <div>
                                        <strong>
                                            {booking.first_name}{' '}
                                            {booking.last_name}
                                        </strong>

                                        <span>
                                            {booking.age_group?.name ||
                                                'Age group pending'}
                                        </span>
                                    </div>

                                    <span
                                        className={`parent-trial-status ${booking.status}`}
                                    >
                                        {booking.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default ParentTrialBooking;