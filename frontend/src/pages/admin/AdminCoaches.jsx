import { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminCoaches.css';

export default function AdminCoaches() {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCoaches = async () => {
        try {
            const response = await api.get('/admin/coaches');
            setCoaches(response.data.coaches || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load coaches.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoaches();
    }, []);

    const activeCoaches = coaches.filter(
        (coach) => coach.is_active
    ).length;

    const totalExperience = coaches.reduce(
        (total, coach) => total + Number(coach.experience_years || 0),
        0
    );

    return (
        <div className="admin-coaches-page">
            <section className="admin-coaches-hero">
                <div>
                    <span>ACADEMY MANAGEMENT</span>
                    <h1>Coaches</h1>
                    <p>
                        Manage academy coaching staff and their professional
                        information.
                    </p>
                </div>

                <div className="admin-coaches-hero-icon">★</div>
            </section>

            <section className="admin-coaches-summary">
                <div className="admin-coaches-summary-card">
                    <span>TOTAL COACHES</span>
                    <strong>{coaches.length}</strong>
                </div>

                <div className="admin-coaches-summary-card">
                    <span>ACTIVE COACHES</span>
                    <strong>{activeCoaches}</strong>
                </div>

                <div className="admin-coaches-summary-card">
                    <span>TOTAL EXPERIENCE</span>
                    <strong>{totalExperience} yrs</strong>
                </div>
            </section>

            {loading && (
                <div className="admin-coaches-state">
                    <div className="admin-coaches-spinner"></div>
                    <h2>Loading coaches...</h2>
                    <p>Please wait while we load the coaching staff.</p>
                </div>
            )}

            {!loading && error && (
                <div className="admin-coaches-state">
                    <div className="admin-coaches-state-icon">!</div>
                    <h2>Unable to load coaches</h2>
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && coaches.length === 0 && (
                <div className="admin-coaches-state">
                    <div className="admin-coaches-state-icon">★</div>
                    <h2>No coaches yet</h2>
                    <p>No coaching staff members are available.</p>
                </div>
            )}

            {!loading && !error && coaches.length > 0 && (
                <section className="admin-coaches-grid">
                    {coaches.map((coach) => (
                        <article
                            className="admin-coach-card"
                            key={coach.id}
                        >
                            <div className="admin-coach-card-top">
                                <div className="admin-coach-avatar">
                                    {coach.full_name
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </div>

                                <span
                                    className={`admin-coach-status ${
                                        coach.is_active
                                            ? 'active'
                                            : 'inactive'
                                    }`}
                                >
                                    {coach.is_active
                                        ? 'Active'
                                        : 'Inactive'}
                                </span>
                            </div>

                            <div className="admin-coach-info">
                                <h2>{coach.full_name}</h2>

                                <span className="admin-coach-specialization">
                                    {coach.specialization ||
                                        'General Coaching'}
                                </span>

                                <div className="admin-coach-details">
                                    <div>
                                        <span>EXPERIENCE</span>
                                        <strong>
                                            {coach.experience_years || 0} years
                                        </strong>
                                    </div>

                                    <div>
                                        <span>ACADEMY</span>
                                        <strong>
                                            {coach.academy?.name ||
                                                'Not assigned'}
                                        </strong>
                                    </div>
                                </div>

                                {coach.phone && (
                                    <div className="admin-coach-contact">
                                        <span>PHONE</span>
                                        <strong>{coach.phone}</strong>
                                    </div>
                                )}

                                {coach.user?.email && (
                                    <div className="admin-coach-contact">
                                        <span>ACCOUNT</span>
                                        <strong>{coach.user.email}</strong>
                                    </div>
                                )}

                                {coach.bio && (
                                    <p className="admin-coach-bio">
                                        {coach.bio}
                                    </p>
                                )}
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </div>
    );
}