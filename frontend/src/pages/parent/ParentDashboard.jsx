import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './ParentDashboard.css';

export default function ParentDashboard() {
    const { user } = useAuth();
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await api.get('/players');
                setPlayers(response.data.players || []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load your players.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, []);

    return (
        <div className="parent-dashboard">
            <section className="parent-welcome">
                <div>
                    <span className="parent-eyebrow">PARENT PORTAL</span>
                    <h1>
                        Welcome back, {user?.name?.split(' ')[0] || 'Parent'}.
                    </h1>
                    <p>
                        Keep track of your players, training and academy journey
                        from one place.
                    </p>
                </div>

                <div className="parent-welcome-ball">
                    ⚽
                </div>
            </section>

            <section className="parent-stats">
                <div className="parent-stat-card">
                    <div className="parent-stat-icon">⚽</div>
                    <div>
                        <span>MY PLAYERS</span>
                        <strong>{players.length}</strong>
                    </div>
                </div>

                <div className="parent-stat-card">
                    <div className="parent-stat-icon">▣</div>
                    <div>
                        <span>UPCOMING TRAINING</span>
                        <strong>0</strong>
                    </div>
                </div>

                <div className="parent-stat-card">
                    <div className="parent-stat-icon">$</div>
                    <div>
                        <span>PENDING PAYMENTS</span>
                        <strong>0</strong>
                    </div>
                </div>

                <div className="parent-stat-card">
                    <div className="parent-stat-icon">◌</div>
                    <div>
                        <span>NOTIFICATIONS</span>
                        <strong>0</strong>
                    </div>
                </div>
            </section>

            <section className="parent-dashboard-grid">
                <div className="parent-panel">
                    <div className="parent-panel-header">
                        <div>
                            <span>PLAYER OVERVIEW</span>
                            <h2>My Players</h2>
                        </div>

                        <button type="button">View All</button>
                    </div>

                    {loading && (
                        <div className="parent-empty-state">
                            <div className="parent-empty-icon">⏳</div>
                            <h3>Loading players...</h3>
                            <p>
                                Please wait while we load your academy players.
                            </p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="parent-empty-state">
                            <div className="parent-empty-icon">!</div>
                            <h3>Unable to load players</h3>
                            <p>{error}</p>
                        </div>
                    )}

                    {!loading && !error && players.length === 0 && (
                        <div className="parent-empty-state">
                            <div className="parent-empty-icon">⚽</div>
                            <h3>No players yet</h3>
                            <p>
                                Add your first player to start managing their
                                football academy journey.
                            </p>
                            <button type="button">Add Player</button>
                        </div>
                    )}

                    {!loading && !error && players.length > 0 && (
                        <div className="parent-player-list">
                            {players.map((player) => (
                                <div
                                    className="parent-player-card"
                                    key={player.id}
                                >
                                    <div className="parent-player-avatar">
                                        {player.first_name?.charAt(0)?.toUpperCase()}
                                    </div>

                                    <div className="parent-player-info">
                                        <strong>
                                            {player.first_name} {player.last_name}
                                        </strong>

                                        <span>
                                            {player.age_group?.name || 'Age group not assigned'}
                                        </span>
                                    </div>

                                    <div className="parent-player-status">
                                        {player.registration_status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="parent-panel parent-quick-panel">
                    <div className="parent-panel-header">
                        <div>
                            <span>QUICK ACCESS</span>
                            <h2>Academy Services</h2>
                        </div>
                    </div>

                    <div className="parent-quick-links">
                        <button type="button">
                            <span>⚽</span>
                            <div>
                                <strong>My Players</strong>
                                <small>Manage player profiles</small>
                            </div>
                            <b>→</b>
                        </button>

                        <button type="button">
                            <span>▣</span>
                            <div>
                                <strong>Training</strong>
                                <small>View upcoming sessions</small>
                            </div>
                            <b>→</b>
                        </button>

                        <button type="button">
                            <span>$</span>
                            <div>
                                <strong>Payments</strong>
                                <small>Check payment status</small>
                            </div>
                            <b>→</b>
                        </button>

                        <button type="button">
                            <span>◌</span>
                            <div>
                                <strong>Notifications</strong>
                                <small>View academy updates</small>
                            </div>
                            <b>→</b>
                        </button>
                    </div>
                </div>
            </section>

            <section className="parent-profile-card">
                <div className="parent-profile-avatar">
                    {user?.name?.charAt(0)?.toUpperCase() || 'P'}
                </div>

                <div className="parent-profile-info">
                    <span>ACCOUNT</span>
                    <h2>{user?.name}</h2>
                    <p>{user?.email}</p>
                </div>

                <div className="parent-profile-role">
                    <span>ACCOUNT TYPE</span>
                    <strong>Parent</strong>
                </div>
            </section>
        </div>
    );
}