import { useEffect, useState } from 'react';
import api from '../../services/api';
import './ParentPlayers.css';

export default function ParentPlayers() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);

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

    const handleViewProfile = async (playerId) => {
        setProfileLoading(true);

        try {
            const response = await api.get(`/players/${playerId}`);
            setSelectedPlayer(response.data.player);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load player profile.'
            );
        } finally {
            setProfileLoading(false);
        }
    };

    return (
        <div className="parent-players-page">
            <section className="parent-players-hero">
                <div>
                    <span>PLAYER MANAGEMENT</span>

                    <h1>My Players</h1>

                    <p>
                        Manage and view the football profiles of your academy
                        players.
                    </p>
                </div>

                <div className="parent-players-ball">
                    ⚽
                </div>
            </section>

            <section className="parent-players-summary">
                <div>
                    <span>REGISTERED PLAYERS</span>
                    <strong>{players.length}</strong>
                </div>
            </section>

            {loading && (
                <div className="parent-players-state">
                    <div className="parent-players-spinner"></div>

                    <h2>Loading players...</h2>

                    <p>
                        Please wait while we load your academy players.
                    </p>
                </div>
            )}

            {!loading && error && (
                <div className="parent-players-state">
                    <div className="parent-players-state-icon">!</div>

                    <h2>Unable to load players</h2>

                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && players.length === 0 && (
                <div className="parent-players-state">
                    <div className="parent-players-state-icon">⚽</div>

                    <h2>No players yet</h2>

                    <p>
                        There are currently no players connected to your
                        academy account.
                    </p>
                </div>
            )}

            {!loading && !error && players.length > 0 && (
                <section className="parent-players-list">
                    {players.map((player) => (
                        <article
                            className="parent-players-card"
                            key={player.id}
                        >
                            <div className="parent-players-avatar">
                                {player.first_name
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                            </div>

                            <div className="parent-players-main">
                                <div className="parent-players-heading">
                                    <div>
                                        <span>PLAYER</span>

                                        <h2>
                                            {player.first_name}{' '}
                                            {player.last_name}
                                        </h2>
                                    </div>

                                    <span
                                        className={`parent-players-status ${player.registration_status}`}
                                    >
                                        {player.registration_status}
                                    </span>
                                </div>

                                <div className="parent-players-info">
                                    <div>
                                        <span>AGE GROUP</span>

                                        <strong>
                                            {player.age_group?.name ||
                                                'Not assigned'}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>POSITION</span>

                                        <strong>
                                            {player.position
                                                ? player.position
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                  player.position.slice(1)
                                                : 'Not assigned'}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>LEVEL</span>

                                        <strong>
                                            {player.level
                                                ? player.level
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                  player.level.slice(1)
                                                : 'Beginner'}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>COACH</span>

                                        <strong>
                                            {player.coach?.full_name ||
                                                'Not assigned'}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="parent-players-view"
                                onClick={() =>
                                    handleViewProfile(player.id)
                                }
                            >
                                View Profile
                                <span>→</span>
                            </button>
                        </article>
                    ))}
                </section>
            )}

            {selectedPlayer && (
                <div className="parent-players-overlay">
                    <div className="parent-players-modal">
                        <button
                            type="button"
                            className="parent-players-close"
                            onClick={() => setSelectedPlayer(null)}
                        >
                            ×
                        </button>

                        <div className="parent-players-modal-top">
                            <div className="parent-players-modal-avatar">
                                {selectedPlayer.first_name
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                            </div>

                            <div>
                                <span>PLAYER PROFILE</span>

                                <h2>
                                    {selectedPlayer.first_name}{' '}
                                    {selectedPlayer.last_name}
                                </h2>

                                <p>
                                    {selectedPlayer.registration_status}
                                </p>
                            </div>
                        </div>

                        <div className="parent-players-modal-grid">
                            <div>
                                <span>DATE OF BIRTH</span>

                                <strong>
                                    {selectedPlayer.date_of_birth ||
                                        'Not available'}
                                </strong>
                            </div>

                            <div>
                                <span>AGE GROUP</span>

                                <strong>
                                    {selectedPlayer.age_group?.name ||
                                        'Not assigned'}
                                </strong>
                            </div>

                            <div>
                                <span>POSITION</span>

                                <strong>
                                    {selectedPlayer.position
                                        ? selectedPlayer.position
                                              .charAt(0)
                                              .toUpperCase() +
                                          selectedPlayer.position.slice(1)
                                        : 'Not assigned'}
                                </strong>
                            </div>

                            <div>
                                <span>LEVEL</span>

                                <strong>
                                    {selectedPlayer.level
                                        ? selectedPlayer.level
                                              .charAt(0)
                                              .toUpperCase() +
                                          selectedPlayer.level.slice(1)
                                        : 'Not assigned'}
                                </strong>
                            </div>

                            <div>
                                <span>COACH</span>

                                <strong>
                                    {selectedPlayer.coach?.full_name ||
                                        'Not assigned'}
                                </strong>
                            </div>

                            <div>
                                <span>BRANCH</span>

                                <strong>
                                    {selectedPlayer.branch?.name ||
                                        'Not assigned'}
                                </strong>
                            </div>

                            <div>
                                <span>CITY</span>

                                <strong>
                                    {selectedPlayer.city ||
                                        'Not available'}
                                </strong>
                            </div>

                            <div>
                                <span>PHONE</span>

                                <strong>
                                    {selectedPlayer.phone ||
                                        'Not available'}
                                </strong>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="parent-players-modal-button"
                            onClick={() => setSelectedPlayer(null)}
                        >
                            Close Profile
                        </button>
                    </div>
                </div>
            )}

            {profileLoading && (
                <div className="parent-players-loading">
                    <div className="parent-players-loading-box">
                        <div className="parent-players-spinner"></div>

                        <span>Loading player profile...</span>
                    </div>
                </div>
            )}
        </div>
    );
}