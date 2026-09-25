import { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminAgeGroups.css';

export default function AdminAgeGroups() {
    const [ageGroups, setAgeGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAgeGroups = async () => {
        try {
            const response = await api.get('/admin/age-groups');
            setAgeGroups(response.data.age_groups || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load age groups.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgeGroups();
    }, []);

    const activeGroups = ageGroups.filter(
        (group) => group.is_active
    ).length;

    const totalPlayers = ageGroups.reduce(
        (total, group) => total + Number(group.players_count || 0),
        0
    );

    return (
        <div className="admin-age-groups-page">
            <section className="admin-age-groups-hero">
                <div>
                    <span>ACADEMY STRUCTURE</span>
                    <h1>Age Groups</h1>
                    <p>
                        Organize players into academy age groups and training
                        categories.
                    </p>
                </div>

                <div className="admin-age-groups-hero-icon">◫</div>
            </section>

            <section className="admin-age-groups-summary">
                <div className="admin-age-groups-summary-card">
                    <span>TOTAL GROUPS</span>
                    <strong>{ageGroups.length}</strong>
                </div>

                <div className="admin-age-groups-summary-card">
                    <span>ACTIVE GROUPS</span>
                    <strong>{activeGroups}</strong>
                </div>

                <div className="admin-age-groups-summary-card">
                    <span>ASSIGNED PLAYERS</span>
                    <strong>{totalPlayers}</strong>
                </div>
            </section>

            {loading && (
                <div className="admin-age-groups-state">
                    <div className="admin-age-groups-spinner"></div>
                    <h2>Loading age groups...</h2>
                    <p>Please wait while we load academy groups.</p>
                </div>
            )}

            {!loading && error && (
                <div className="admin-age-groups-state">
                    <div className="admin-age-groups-state-icon">!</div>
                    <h2>Unable to load age groups</h2>
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && ageGroups.length === 0 && (
                <div className="admin-age-groups-state">
                    <div className="admin-age-groups-state-icon">◫</div>
                    <h2>No age groups yet</h2>
                    <p>No academy age groups are available.</p>
                </div>
            )}

            {!loading && !error && ageGroups.length > 0 && (
                <section className="admin-age-groups-grid">
                    {ageGroups.map((group) => (
                        <article
                            className="admin-age-group-card"
                            key={group.id}
                        >
                            <div className="admin-age-group-top">
                                <div className="admin-age-group-number">
                                    {group.id}
                                </div>

                                <span
                                    className={`admin-age-group-status ${
                                        group.is_active
                                            ? 'active'
                                            : 'inactive'
                                    }`}
                                >
                                    {group.is_active
                                        ? 'Active'
                                        : 'Inactive'}
                                </span>
                            </div>

                            <h2>{group.name}</h2>

                            <div className="admin-age-group-range">
                                <strong>
                                    {group.min_age} - {group.max_age}
                                </strong>
                                <span>YEARS OLD</span>
                            </div>

                            <div className="admin-age-group-info">
                                <div>
                                    <span>PLAYERS</span>
                                    <strong>
                                        {group.players_count || 0}
                                    </strong>
                                </div>

                                <div>
                                    <span>ACADEMY</span>
                                    <strong>
                                        {group.academy?.name ||
                                            'Not assigned'}
                                    </strong>
                                </div>
                            </div>

                            {group.description && (
                                <p className="admin-age-group-description">
                                    {group.description}
                                </p>
                            )}
                        </article>
                    ))}
                </section>
            )}
        </div>
    );
}