import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './ParentDashboard.css';

export default function ParentDashboard() {
    const { user } = useAuth();
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [showAddPlayer, setShowAddPlayer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(false);
    const [addingPlayer, setAddingPlayer] = useState(false);
    const [error, setError] = useState('');
    const [profileError, setProfileError] = useState('');
    const [formError, setFormError] = useState('');

    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        position: '',
        level: 'beginner',
        phone: '',
        city: '',
        address: '',
    });

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
        setProfileError('');

        try {
            const response = await api.get(`/players/${playerId}`);
            setSelectedPlayer(response.data.player);
        } catch (err) {
            setProfileError(
                err.response?.data?.message ||
                'Unable to load player profile.'
            );
        } finally {
            setProfileLoading(false);
        }
    };

    const closeProfile = () => {
        setSelectedPlayer(null);
        setProfileError('');
    };

    const openAddPlayer = () => {
        setFormError('');
        setForm({
            first_name: '',
            last_name: '',
            date_of_birth: '',
            position: '',
            level: 'beginner',
            phone: '',
            city: '',
            address: '',
        });
        setShowAddPlayer(true);
    };

    const closeAddPlayer = () => {
        if (!addingPlayer) {
            setShowAddPlayer(false);
            setFormError('');
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleAddPlayer = async (e) => {
        e.preventDefault();
        setFormError('');
        setAddingPlayer(true);

        try {
            const response = await api.post('/players', {
                academy_id: 1,
                first_name: form.first_name,
                last_name: form.last_name,
                date_of_birth: form.date_of_birth,
                position: form.position || null,
                level: form.level,
                phone: form.phone || null,
                city: form.city || null,
                address: form.address || null,
            });

            const newPlayer = response.data.player;

            const profileResponse = await api.get(
                `/players/${newPlayer.id}`
            );

            setPlayers((current) => [
                profileResponse.data.player,
                ...current,
            ]);

            setShowAddPlayer(false);
            setForm({
                first_name: '',
                last_name: '',
                date_of_birth: '',
                position: '',
                level: 'beginner',
                phone: '',
                city: '',
                address: '',
            });
        } catch (err) {
            const validationErrors = err.response?.data?.errors;

            if (validationErrors) {
                const firstError = Object.values(validationErrors)[0];
                setFormError(
                    Array.isArray(firstError)
                        ? firstError[0]
                        : firstError
                );
            } else {
                setFormError(
                    err.response?.data?.message ||
                    'Unable to add player.'
                );
            }
        } finally {
            setAddingPlayer(false);
        }
    };

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

                        <button
                            type="button"
                            onClick={openAddPlayer}
                        >
                            Add Player
                        </button>
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

                            <button
                                type="button"
                                onClick={openAddPlayer}
                            >
                                Add Player
                            </button>
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
                                        {player.first_name
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </div>

                                    <div className="parent-player-main">
                                        <div className="parent-player-heading">
                                            <div>
                                                <span className="parent-player-label">
                                                    PLAYER
                                                </span>

                                                <h3>
                                                    {player.first_name}{' '}
                                                    {player.last_name}
                                                </h3>
                                            </div>

                                            <span
                                                className={`parent-player-status ${player.registration_status}`}
                                            >
                                                {player.registration_status}
                                            </span>
                                        </div>

                                        <div className="parent-player-details">
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
                                                          player.position.slice(
                                                              1
                                                          )
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
                                        className="parent-player-view"
                                        onClick={() =>
                                            handleViewProfile(player.id)
                                        }
                                    >
                                        View Profile
                                        <span>→</span>
                                    </button>
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
                        <button
                            type="button"
                            onClick={openAddPlayer}
                        >
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

            {selectedPlayer && (
                <div className="parent-profile-overlay">
                    <div className="parent-player-modal">
                        <button
                            type="button"
                            className="parent-modal-close"
                            onClick={closeProfile}
                        >
                            ×
                        </button>

                        <div className="parent-modal-top">
                            <div className="parent-modal-avatar">
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

                        {profileError && (
                            <div className="parent-modal-error">
                                {profileError}
                            </div>
                        )}

                        <div className="parent-modal-details">
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
                            className="parent-modal-button"
                            onClick={closeProfile}
                        >
                            Close Profile
                        </button>
                    </div>
                </div>
            )}

            {showAddPlayer && (
                <div className="parent-profile-overlay">
                    <div className="parent-player-modal parent-add-player-modal">
                        <button
                            type="button"
                            className="parent-modal-close"
                            onClick={closeAddPlayer}
                        >
                            ×
                        </button>

                        <div className="parent-modal-heading">
                            <span>PLAYER MANAGEMENT</span>

                            <h2>Add New Player</h2>

                            <p>
                                Add a player to your academy account.
                            </p>
                        </div>

                        {formError && (
                            <div className="parent-modal-error">
                                {formError}
                            </div>
                        )}

                        <form
                            className="parent-add-player-form"
                            onSubmit={handleAddPlayer}
                        >
                            <div className="parent-form-grid">
                                <div className="parent-form-field">
                                    <label htmlFor="first_name">
                                        First Name
                                    </label>

                                    <input
                                        id="first_name"
                                        name="first_name"
                                        type="text"
                                        value={form.first_name}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Enter first name"
                                    />
                                </div>

                                <div className="parent-form-field">
                                    <label htmlFor="last_name">
                                        Last Name
                                    </label>

                                    <input
                                        id="last_name"
                                        name="last_name"
                                        type="text"
                                        value={form.last_name}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Enter last name"
                                    />
                                </div>

                                <div className="parent-form-field">
                                    <label htmlFor="date_of_birth">
                                        Date of Birth
                                    </label>

                                    <input
                                        id="date_of_birth"
                                        name="date_of_birth"
                                        type="date"
                                        value={form.date_of_birth}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>

                                <div className="parent-form-field">
                                    <label htmlFor="position">
                                        Position
                                    </label>

                                    <select
                                        id="position"
                                        name="position"
                                        value={form.position}
                                        onChange={handleFormChange}
                                    >
                                        <option value="">
                                            Select position
                                        </option>
                                        <option value="goalkeeper">
                                            Goalkeeper
                                        </option>
                                        <option value="defender">
                                            Defender
                                        </option>
                                        <option value="midfielder">
                                            Midfielder
                                        </option>
                                        <option value="forward">
                                            Forward
                                        </option>
                                    </select>
                                </div>

                                <div className="parent-form-field">
                                    <label htmlFor="level">
                                        Level
                                    </label>

                                    <select
                                        id="level"
                                        name="level"
                                        value={form.level}
                                        onChange={handleFormChange}
                                    >
                                        <option value="beginner">
                                            Beginner
                                        </option>
                                        <option value="intermediate">
                                            Intermediate
                                        </option>
                                        <option value="advanced">
                                            Advanced
                                        </option>
                                    </select>
                                </div>

                                <div className="parent-form-field">
                                    <label htmlFor="phone">
                                        Phone
                                    </label>

                                    <input
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        value={form.phone}
                                        onChange={handleFormChange}
                                        placeholder="Enter phone"
                                    />
                                </div>

                                <div className="parent-form-field">
                                    <label htmlFor="city">
                                        City
                                    </label>

                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        value={form.city}
                                        onChange={handleFormChange}
                                        placeholder="Enter city"
                                    />
                                </div>

                                <div className="parent-form-field">
                                    <label htmlFor="address">
                                        Address
                                    </label>

                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        value={form.address}
                                        onChange={handleFormChange}
                                        placeholder="Enter address"
                                    />
                                </div>
                            </div>

                            <div className="parent-form-actions">
                                <button
                                    type="button"
                                    className="parent-form-cancel"
                                    onClick={closeAddPlayer}
                                    disabled={addingPlayer}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="parent-form-submit"
                                    disabled={addingPlayer}
                                >
                                    {addingPlayer
                                        ? 'Adding Player...'
                                        : 'Add Player'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {profileLoading && (
                <div className="parent-loading-overlay">
                    <div className="parent-loading-box">
                        <div className="parent-loading-spinner"></div>

                        <span>Loading player profile...</span>
                    </div>
                </div>
            )}
        </div>
    );
}