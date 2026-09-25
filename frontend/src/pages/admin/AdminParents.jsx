import { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminParents.css';

export default function AdminParents() {
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchParents = async () => {
        try {
            const response = await api.get('/admin/parents');
            setParents(response.data.parents || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load parents.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParents();
    }, []);

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

    const activePlayers = (parent) =>
        (parent.players || []).filter(
            (player) => player.registration_status === 'active'
        ).length;

    return (
        <div className="admin-parents-page">
            <section className="admin-parents-hero">
                <div>
                    <span>ACADEMY MANAGEMENT</span>
                    <h1>Parents</h1>
                    <p>
                        View academy parents and their registered players.
                    </p>
                </div>

                <div className="admin-parents-hero-icon">◉</div>
            </section>

            <section className="admin-parents-summary">
                <div className="admin-parents-summary-card">
                    <span>TOTAL PARENTS</span>
                    <strong>{parents.length}</strong>
                </div>

                <div className="admin-parents-summary-card">
                    <span>WITH PLAYERS</span>
                    <strong>
                        {
                            parents.filter(
                                (parent) => parent.players_count > 0
                            ).length
                        }
                    </strong>
                </div>

                <div className="admin-parents-summary-card">
                    <span>TOTAL PLAYERS</span>
                    <strong>
                        {parents.reduce(
                            (total, parent) =>
                                total + (parent.players_count || 0),
                            0
                        )}
                    </strong>
                </div>
            </section>

            {loading && (
                <div className="admin-parents-state">
                    <div className="admin-parents-spinner"></div>
                    <h2>Loading parents...</h2>
                    <p>Please wait while we load academy parents.</p>
                </div>
            )}

            {!loading && error && (
                <div className="admin-parents-state">
                    <div className="admin-parents-state-icon">!</div>
                    <h2>Unable to load parents</h2>
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && parents.length === 0 && (
                <div className="admin-parents-state">
                    <div className="admin-parents-state-icon">◉</div>
                    <h2>No parents yet</h2>
                    <p>No registered parents are available.</p>
                </div>
            )}

            {!loading && !error && parents.length > 0 && (
                <section className="admin-parents-table-section">
                    <div className="admin-parents-table-header">
                        <div>
                            <span>PARENT DIRECTORY</span>
                            <h2>All Parents</h2>
                        </div>

                        <span className="admin-parents-count">
                            {parents.length} Parents
                        </span>
                    </div>

                    <div className="admin-parents-table-wrapper">
                        <table className="admin-parents-table">
                            <thead>
                                <tr>
                                    <th>Parent</th>
                                    <th>Email</th>
                                    <th>Players</th>
                                    <th>Active Players</th>
                                    <th>Registered</th>
                                </tr>
                            </thead>

                            <tbody>
                                {parents.map((parent) => (
                                    <tr key={parent.id}>
                                        <td>
                                            <div className="admin-parent-name">
                                                <div className="admin-parent-avatar">
                                                    {parent.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}
                                                </div>

                                                <div>
                                                    <strong>
                                                        {parent.name}
                                                    </strong>
                                                    <span>
                                                        Parent #{parent.id}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <span className="admin-parent-email">
                                                {parent.email}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="admin-parent-number">
                                                {parent.players_count || 0}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="admin-parent-active">
                                                {activePlayers(parent)}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="admin-parent-date">
                                                {formatDate(parent.created_at)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </div>
    );
}