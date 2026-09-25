import { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminTracking.css';

const statuses = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'on_the_way', label: 'On The Way' },
    { value: 'near_stop', label: 'Near Stop' },
    { value: 'at_stop', label: 'At Stop' },
    { value: 'player_picked_up', label: 'Player Picked Up' },
    { value: 'arrived_academy', label: 'Arrived Academy' },
    { value: 'in_training', label: 'In Training' },
    { value: 'return_trip', label: 'Return Trip' },
    { value: 'near_home_stop', label: 'Near Home Stop' },
    { value: 'player_dropped_off', label: 'Player Dropped Off' },
    { value: 'completed', label: 'Completed' },
];

function AdminTracking() {
    const [trackings, setTrackings] = useState([]);
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [players, setPlayers] = useState([]);
    const [stops, setStops] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        bus_id: '',
        bus_route_id: '',
        status: 'scheduled',
        current_stop_id: '',
        current_player_id: '',
        notes: '',
    });

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            const [
                trackingResponse,
                busesResponse,
                routesResponse,
                playersResponse,
            ] = await Promise.all([
                api.get('/admin/tracking'),
                api.get('/admin/transportation/buses'),
                api.get('/admin/transportation/routes'),
                api.get('/admin/players'),
            ]);

            const trackingData = trackingResponse.data.trackings || [];
            const busesData = busesResponse.data.buses || [];
            const routesData = routesResponse.data.routes || [];
            const playersData = playersResponse.data.players || [];

            setTrackings(trackingData);
            setBuses(busesData);
            setRoutes(routesData);
            setPlayers(playersData);

            const allStops = routesData.flatMap((route) =>
                (route.stops || []).map((stop) => ({
                    ...stop,
                    route_id: route.id,
                }))
            );

            setStops(allStops);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load tracking data.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
            ...(name === 'bus_route_id'
                ? {
                      current_stop_id: '',
                  }
                : {}),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.bus_id) {
            setError('Please select a bus.');
            return;
        }

        try {
            setSaving(true);
            setError('');

            await api.post('/admin/tracking', {
                bus_id: Number(form.bus_id),
                bus_route_id: form.bus_route_id
                    ? Number(form.bus_route_id)
                    : null,
                status: form.status,
                current_stop_id: form.current_stop_id
                    ? Number(form.current_stop_id)
                    : null,
                current_player_id: form.current_player_id
                    ? Number(form.current_player_id)
                    : null,
                notes: form.notes || null,
            });

            setForm({
                bus_id: '',
                bus_route_id: '',
                status: 'scheduled',
                current_stop_id: '',
                current_player_id: '',
                notes: '',
            });

            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                Object.values(err.response?.data?.errors || {})?.[0]?.[0] ||
                'Unable to create tracking record.'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async (tracking, status) => {
        try {
            setError('');

            await api.patch(`/admin/tracking/${tracking.id}`, {
                status,
                current_stop_id: tracking.current_stop_id || null,
                current_player_id: tracking.current_player_id || null,
                notes: tracking.notes || null,
            });

            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to update tracking status.'
            );
        }
    };

    const handleDelete = async (id) => {
        if (
            !window.confirm(
                'Are you sure you want to delete this tracking record?'
            )
        ) {
            return;
        }

        try {
            setError('');

            await api.delete(`/admin/tracking/${id}`);

            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to delete tracking record.'
            );
        }
    };

    const getStatusLabel = (status) => {
        return (
            statuses.find((item) => item.value === status)?.label ||
            status
        );
    };

    const getBusName = (tracking) => {
        if (tracking.bus?.name) {
            return tracking.bus.name;
        }

        if (tracking.bus?.bus_number) {
            return `Bus ${tracking.bus.bus_number}`;
        }

        return tracking.bus_id ? `Bus #${tracking.bus_id}` : '-';
    };

    const getRouteName = (tracking) => {
        if (tracking.busRoute?.name) {
            return tracking.busRoute.name;
        }

        if (tracking.busRoute?.route_name) {
            return tracking.busRoute.route_name;
        }

        return tracking.bus_route_id
            ? `Route #${tracking.bus_route_id}`
            : '-';
    };

    const filteredStops = form.bus_route_id
        ? stops.filter(
              (stop) => String(stop.route_id) === String(form.bus_route_id)
          )
        : [];

    if (loading) {
        return (
            <div className="admin-tracking-page">
                <div className="admin-tracking-loading">
                    Loading tracking...
                </div>
            </div>
        );
    }

    return (
        <div className="admin-tracking-page">
            <div className="admin-tracking-header">
                <div>
                    <h1>Bus Tracking</h1>
                    <p>
                        Monitor and simulate academy transportation journeys.
                    </p>
                </div>

                <div className="admin-tracking-live">
                    <span></span>
                    Tracking System
                </div>
            </div>

            {error && (
                <div className="admin-tracking-error">
                    {error}
                </div>
            )}

            <div className="admin-tracking-form-card">
                <div className="admin-tracking-card-header">
                    <div>
                        <h2>Start Journey</h2>
                        <p>Create a new bus tracking journey.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="admin-tracking-form-grid">
                        <div className="admin-tracking-field">
                            <label>Bus</label>
                            <select
                                name="bus_id"
                                value={form.bus_id}
                                onChange={handleChange}
                            >
                                <option value="">Select bus</option>

                                {buses.map((bus) => (
                                    <option key={bus.id} value={bus.id}>
                                        {bus.name ||
                                            bus.bus_number ||
                                            `Bus #${bus.id}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="admin-tracking-field">
                            <label>Route</label>
                            <select
                                name="bus_route_id"
                                value={form.bus_route_id}
                                onChange={handleChange}
                            >
                                <option value="">Select route</option>

                                {routes.map((route) => (
                                    <option key={route.id} value={route.id}>
                                        {route.name ||
                                            route.route_name ||
                                            `Route #${route.id}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="admin-tracking-field">
                            <label>Status</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                {statuses.map((status) => (
                                    <option
                                        key={status.value}
                                        value={status.value}
                                    >
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="admin-tracking-field">
                            <label>Current Stop</label>
                            <select
                                name="current_stop_id"
                                value={form.current_stop_id}
                                onChange={handleChange}
                                disabled={!form.bus_route_id}
                            >
                                <option value="">
                                    {form.bus_route_id
                                        ? 'Select stop'
                                        : 'Select route first'}
                                </option>

                                {filteredStops.map((stop) => (
                                    <option key={stop.id} value={stop.id}>
                                        {stop.name ||
                                            stop.stop_name ||
                                            `Stop #${stop.id}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="admin-tracking-field">
                            <label>Current Player</label>
                            <select
                                name="current_player_id"
                                value={form.current_player_id}
                                onChange={handleChange}
                            >
                                <option value="">
                                    No player selected
                                </option>

                                {players.map((player) => (
                                    <option key={player.id} value={player.id}>
                                        {player.first_name} {player.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="admin-tracking-field">
                            <label>Notes</label>
                            <input
                                type="text"
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                placeholder="Optional notes"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="admin-tracking-submit"
                        disabled={saving}
                    >
                        {saving ? 'Starting...' : 'Start Tracking'}
                    </button>
                </form>
            </div>

            <div className="admin-tracking-overview">
                <div className="admin-tracking-stat">
                    <span className="admin-tracking-stat-icon">🚌</span>
                    <div>
                        <strong>{trackings.length}</strong>
                        <span>Total Journeys</span>
                    </div>
                </div>

                <div className="admin-tracking-stat">
                    <span className="admin-tracking-stat-icon">●</span>
                    <div>
                        <strong>
                            {
                                trackings.filter(
                                    (item) =>
                                        item.status !== 'completed'
                                ).length
                            }
                        </strong>
                        <span>Active Journeys</span>
                    </div>
                </div>

                <div className="admin-tracking-stat">
                    <span className="admin-tracking-stat-icon">✓</span>
                    <div>
                        <strong>
                            {
                                trackings.filter(
                                    (item) =>
                                        item.status === 'completed'
                                ).length
                            }
                        </strong>
                        <span>Completed</span>
                    </div>
                </div>
            </div>

            <div className="admin-tracking-table-card">
                <div className="admin-tracking-table-header">
                    <div>
                        <h2>Live Journeys</h2>
                        <p>Manage current transportation status.</p>
                    </div>

                    <span>{trackings.length} journeys</span>
                </div>

                {trackings.length === 0 ? (
                    <div className="admin-tracking-empty">
                        <div>🚌</div>
                        <h3>No tracking journeys yet</h3>
                        <p>
                            Start a journey using the form above to see it
                            here.
                        </p>
                    </div>
                ) : (
                    <div className="admin-tracking-table-wrapper">
                        <table className="admin-tracking-table">
                            <thead>
                                <tr>
                                    <th>Bus</th>
                                    <th>Route</th>
                                    <th>Status</th>
                                    <th>Current Stop</th>
                                    <th>Player</th>
                                    <th>Notes</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {trackings.map((tracking) => (
                                    <tr key={tracking.id}>
                                        <td>
                                            <strong>
                                                {getBusName(tracking)}
                                            </strong>
                                        </td>

                                        <td>
                                            {getRouteName(tracking)}
                                        </td>

                                        <td>
                                            <select
                                                className={`admin-tracking-status ${tracking.status}`}
                                                value={tracking.status}
                                                onChange={(event) =>
                                                    handleStatusChange(
                                                        tracking,
                                                        event.target.value
                                                    )
                                                }
                                            >
                                                {statuses.map((status) => (
                                                    <option
                                                        key={status.value}
                                                        value={status.value}
                                                    >
                                                        {status.label}
                                                    </option>
                                                ))}
                                            </select>

                                            <span className="admin-tracking-status-label">
                                                {getStatusLabel(
                                                    tracking.status
                                                )}
                                            </span>
                                        </td>

                                        <td>
                                            {tracking.currentStop?.name ||
                                                tracking.currentStop
                                                    ?.stop_name ||
                                                (tracking.current_stop_id
                                                    ? `Stop #${tracking.current_stop_id}`
                                                    : '-')}
                                        </td>

                                        <td>
                                            {tracking.currentPlayer
                                                ? `${tracking.currentPlayer.first_name} ${tracking.currentPlayer.last_name}`
                                                : tracking.current_player_id
                                                  ? `Player #${tracking.current_player_id}`
                                                  : '-'}
                                        </td>

                                        <td>
                                            {tracking.notes || '-'}
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="admin-tracking-delete"
                                                onClick={() =>
                                                    handleDelete(
                                                        tracking.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminTracking;