import { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminPlayers.css';

export default function AdminPlayers() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPlayers = async () => {
        try {
            const response = await api.get('/admin/players');
            setPlayers(response.data.players || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load players.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlayers();
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

    const formatValue = (value) => {
        if (!value) {
            return 'Not assigned';
        }

        return value;
    };

    return (
        <div className="admin-players-page">
            <section className="admin-players-hero">
                <div>
                    <span>ACADEMY MANAGEMENT</span>
                    <h1>Players</h1>
                    <p>
                        View and manage all registered academy players.
                    </p>
                </div>

                <div className="admin-players-hero-icon">⚽</div>
            </section>

            <section className="admin-players-summary">
                <div className="admin-players-summary-card">
                    <span>TOTAL PLAYERS</span>
                    <strong>{players.length}</strong>
                </div>

                <div className="admin-players-summary-card">
                    <span>ACTIVE PLAYERS</span>
                    <strong>
                        {
                            players.filter(
                                (player) =>
                                    player.registration_status === 'active'
                            ).length
                        }
                    </strong>
                </div>

                <div className="admin-players-summary-card">
                    <span>PENDING</span>
                    <strong>
                        {
                            players.filter(
                                (player) =>
                                    player.registration_status === 'pending'
                            ).length
                        }
                    </strong>
                </div>
            </section>

            {loading && (
                <div className="admin-players-state">
                    <div className="admin-players-spinner"></div>
                    <h2>Loading players...</h2>
                    <p>Please wait while we load academy players.</p>
                </div>
            )}

            {!loading && error && (
                <div className="admin-players-state">
                    <div className="admin-players-state-icon">!</div>
                    <h2>Unable to load players</h2>
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && players.length === 0 && (
                <div className="admin-players-state">
                    <div className="admin-players-state-icon">⚽</div>
                    <h2>No players yet</h2>
                    <p>No registered players are available.</p>
                </div>
            )}

            {!loading && !error && players.length > 0 && (
                <section className="admin-players-table-section">
                    <div className="admin-players-table-header">
                        <div>
                            <span>PLAYER DIRECTORY</span>
                            <h2>All Players</h2>
                        </div>

                        <span className="admin-players-count">
                            {players.length} Players
                        </span>
                    </div>

                    <div className="admin-players-table-wrapper">
                        <table className="admin-players-table">
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Parent</th>
                                    <th>Age Group</th>
                                    <th>Coach</th>
                                    <th>Position</th>
                                    <th>Level</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {players.map((player) => (
                                    <tr key={player.id}>
                                        <td>
                                            <div className="admin-player-name">
                                                <div className="admin-player-avatar">
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
                                                        DOB:{' '}
                                                        {formatDate(
                                                            player.date_of_birth
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="admin-player-parent">
                                                <strong>
                                                    {formatValue(
                                                        player.parent?.name
                                                    )}
                                                </strong>

                                                <span>
                                                    {formatValue(
                                                        player.parent?.email
                                                    )}
                                                </span>
                                            </div>
                                        </td>

                                        <td>
                                            {formatValue(
                                                player.age_group?.name
                                            )}
                                        </td>

                                        <td>
                                            {formatValue(
                                                player.coach?.full_name
                                            )}
                                        </td>

                                        <td>
                                            <span className="admin-player-tag">
                                                {formatValue(
                                                    player.position
                                                )}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="admin-player-tag">
                                                {formatValue(player.level)}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={`admin-player-status ${
                                                    player.registration_status ||
                                                    'pending'
                                                }`}
                                            >
                                                {player.registration_status ||
                                                    'pending'}
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