import { useEffect, useState } from 'react';
import api from '../../services/api';
import './ParentTracking.css';

const statuses = [
    { value: 'scheduled', label: 'Bus Scheduled' },
    { value: 'on_the_way', label: 'On The Way' },
    { value: 'near_stop', label: 'Near Stop' },
    { value: 'at_stop', label: 'At Stop' },
    { value: 'player_picked_up', label: 'Player Picked Up' },
    { value: 'arrived_academy', label: 'Arrived Academy' },
    { value: 'in_training', label: 'Player In Training' },
    { value: 'return_trip', label: 'Return Trip' },
    { value: 'near_home_stop', label: 'Near Home Stop' },
    { value: 'player_dropped_off', label: 'Player Dropped Off' },
    { value: 'completed', label: 'Journey Completed' },
];

function ParentTracking() {
    const [trackings, setTrackings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadTracking = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await api.get('/tracking');

            setTrackings(response.data.trackings || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load tracking information.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTracking();

        const interval = setInterval(loadTracking, 30000);

        return () => clearInterval(interval);
    }, []);

    const getStatusIndex = (status) => {
        return statuses.findIndex((item) => item.value === status);
    };

    const getStatusLabel = (status) => {
        return (
            statuses.find((item) => item.value === status)?.label ||
            status
        );
    };

    const getBusPosition = (status) => {
        const positions = {
            scheduled: 4,
            on_the_way: 14,
            near_stop: 25,
            at_stop: 35,
            player_picked_up: 45,
            arrived_academy: 56,
            in_training: 56,
            return_trip: 70,
            near_home_stop: 82,
            player_dropped_off: 92,
            completed: 96,
        };

        return positions[status] ?? 4;
    };

    if (loading) {
        return (
            <div className="parent-tracking-page">
                <div className="parent-tracking-loading">
                    Loading tracking...
                </div>
            </div>
        );
    }

    return (
        <div className="parent-tracking-page">
            <div className="parent-tracking-header">
                <div>
                    <span className="parent-tracking-eyebrow">
                        TRANSPORTATION
                    </span>

                    <h1>Track Your Player</h1>

                    <p>
                        Follow your player's academy transportation journey.
                    </p>
                </div>

                <div className="parent-tracking-live">
                    <span></span>
                    Live Tracking
                </div>
            </div>

            {error && (
                <div className="parent-tracking-error">
                    {error}
                </div>
            )}

            {trackings.length === 0 ? (
                <div className="parent-tracking-empty">
                    <div className="parent-tracking-empty-icon">🚌</div>

                    <h2>No Active Journey</h2>

                    <p>
                        There is currently no transportation journey available
                        for your player.
                    </p>
                </div>
            ) : (
                <div className="parent-tracking-list">
                    {trackings.map((tracking) => {
                        const currentIndex = getStatusIndex(
                            tracking.status
                        );

                        const busPosition = getBusPosition(
                            tracking.status
                        );

                        return (
                            <div
                                className="parent-tracking-card"
                                key={tracking.id}
                            >
                                <div className="parent-tracking-card-top">
                                    <div>
                                        <span className="parent-tracking-card-label">
                                            CURRENT JOURNEY
                                        </span>

                                        <h2>
                                            {tracking.bus?.name ||
                                                tracking.bus?.bus_number ||
                                                `Bus #${tracking.bus_id}`}
                                        </h2>

                                        <p>
                                            {tracking.busRoute?.name ||
                                                tracking.busRoute?.route_name ||
                                                `Route #${tracking.bus_route_id}`}
                                        </p>
                                    </div>

                                    <div
                                        className={`parent-tracking-current-status ${tracking.status}`}
                                    >
                                        {getStatusLabel(
                                            tracking.status
                                        )}
                                    </div>
                                </div>

                                <div className="parent-tracking-animation">
                                    <div className="parent-tracking-animation-header">
                                        <span>Journey Progress</span>
                                        <strong>
                                            {getStatusLabel(
                                                tracking.status
                                            )}
                                        </strong>
                                    </div>

                                    <div className="parent-tracking-road">
                                        <div className="parent-tracking-road-line"></div>

                                        <div
                                            className="parent-tracking-bus"
                                            style={{
                                                left: `${busPosition}%`,
                                            }}
                                        >
                                            🚌
                                        </div>

                                        <div className="parent-tracking-road-stop start">
                                            <span></span>
                                            <small>Home</small>
                                        </div>

                                        <div className="parent-tracking-road-stop middle">
                                            <span></span>
                                            <small>Academy</small>
                                        </div>

                                        <div className="parent-tracking-road-stop end">
                                            <span></span>
                                            <small>Home</small>
                                        </div>
                                    </div>
                                </div>

                                <div className="parent-tracking-progress">
                                    <div className="parent-tracking-progress-line"></div>

                                    {statuses.map((status, index) => {
                                        const completed =
                                            index <= currentIndex;

                                        const active =
                                            index === currentIndex;

                                        return (
                                            <div
                                                key={status.value}
                                                className={`parent-tracking-step ${
                                                    completed
                                                        ? 'completed'
                                                        : ''
                                                } ${
                                                    active
                                                        ? 'active'
                                                        : ''
                                                }`}
                                            >
                                                <div className="parent-tracking-step-dot">
                                                    {completed
                                                        ? '✓'
                                                        : ''}
                                                </div>

                                                <span>
                                                    {status.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="parent-tracking-details">
                                    <div className="parent-tracking-detail">
                                        <span>Current Stop</span>

                                        <strong>
                                            {tracking.currentStop?.name ||
                                                tracking.currentStop
                                                    ?.stop_name ||
                                                (tracking.current_stop_id
                                                    ? `Stop #${tracking.current_stop_id}`
                                                    : 'Not specified')}
                                        </strong>
                                    </div>

                                    <div className="parent-tracking-detail">
                                        <span>Player</span>

                                        <strong>
                                            {tracking.currentPlayer
                                                ? `${tracking.currentPlayer.first_name} ${tracking.currentPlayer.last_name}`
                                                : 'Your player'}
                                        </strong>
                                    </div>

                                    <div className="parent-tracking-detail">
                                        <span>Status</span>

                                        <strong>
                                            {getStatusLabel(
                                                tracking.status
                                            )}
                                        </strong>
                                    </div>
                                </div>

                                {tracking.notes && (
                                    <div className="parent-tracking-notes">
                                        <span>Journey Note</span>
                                        <p>{tracking.notes}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ParentTracking;