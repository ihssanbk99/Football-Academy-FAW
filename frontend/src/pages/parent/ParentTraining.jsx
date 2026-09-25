import { useEffect, useState } from 'react';
import api from '../../services/api';
import './ParentTraining.css';

export default function ParentTraining() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTrainingSessions = async () => {
            try {
                const response = await api.get('/training-sessions');
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

        fetchTrainingSessions();
    }, []);

    const formatDate = (date) => {
        if (!date) {
            return 'Not available';
        }

        return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
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

        return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const formatType = (type) => {
        if (!type) {
            return 'Regular';
        }

        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    return (
        <div className="parent-training-page">
            <section className="parent-training-hero">
                <div>
                    <span>TRAINING CENTER</span>

                    <h1>Training Sessions</h1>

                    <p>
                        Stay up to date with your players' upcoming academy
                        training sessions.
                    </p>
                </div>

                <div className="parent-training-ball">
                    ⚽
                </div>
            </section>

            <section className="parent-training-summary">
                <div>
                    <span>UPCOMING SESSIONS</span>
                    <strong>{sessions.length}</strong>
                </div>

                <div>
                    <span>ACTIVE TRAINING</span>
                    <strong>{sessions.filter((session) => session.is_active).length}</strong>
                </div>
            </section>

            {loading && (
                <div className="parent-training-state">
                    <div className="parent-training-spinner"></div>

                    <h2>Loading training sessions...</h2>

                    <p>
                        Please wait while we load your academy training schedule.
                    </p>
                </div>
            )}

            {!loading && error && (
                <div className="parent-training-state">
                    <div className="parent-training-state-icon">!</div>

                    <h2>Unable to load training</h2>

                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && sessions.length === 0 && (
                <div className="parent-training-state">
                    <div className="parent-training-state-icon">▣</div>

                    <h2>No training sessions yet</h2>

                    <p>
                        There are currently no training sessions available for
                        your players.
                    </p>
                </div>
            )}

            {!loading && !error && sessions.length > 0 && (
                <section className="parent-training-list">
                    {sessions.map((session) => (
                        <article
                            className="parent-training-card"
                            key={session.id}
                        >
                            <div className="parent-training-card-top">
                                <div>
                                    <span>TRAINING SESSION</span>

                                    <h2>{session.title}</h2>
                                </div>

                                <div className="parent-training-type">
                                    {formatType(session.training_type)}
                                </div>
                            </div>

                            <div className="parent-training-info-grid">
                                <div>
                                    <span>DATE</span>
                                    <strong>
                                        {formatDate(session.session_date)}
                                    </strong>
                                </div>

                                <div>
                                    <span>TIME</span>
                                    <strong>
                                        {formatTime(session.start_time)} -{' '}
                                        {formatTime(session.end_time)}
                                    </strong>
                                </div>

                                <div>
                                    <span>FIELD</span>
                                    <strong>
                                        {session.field_name || 'Not assigned'}
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
                                    <span>AGE GROUP</span>
                                    <strong>
                                        {session.age_group?.name ||
                                            'Not assigned'}
                                    </strong>
                                </div>

                                <div>
                                    <span>BRANCH</span>
                                    <strong>
                                        {session.branch?.name ||
                                            'All branches'}
                                    </strong>
                                </div>
                            </div>

                            {session.notes && (
                                <div className="parent-training-notes">
                                    <span>SESSION NOTES</span>
                                    <p>{session.notes}</p>
                                </div>
                            )}
                        </article>
                    ))}
                </section>
            )}
        </div>
    );
}