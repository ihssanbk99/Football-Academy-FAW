import { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminTransportation.css';

export default function AdminTransportation() {
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [players, setPlayers] = useState([]);
    const [activeTab, setActiveTab] = useState('buses');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [busForm, setBusForm] = useState({
        bus_number: '',
        name: '',
        capacity: '',
        driver_name: '',
        driver_phone: '',
        departure_time: '',
    });

    const [routeForm, setRouteForm] = useState({
        bus_id: '',
        name: '',
        area: '',
        departure_time: '',
        return_time: '',
    });

    const [stopForm, setStopForm] = useState({
        route_id: '',
        name: '',
        address: '',
        pickup_time: '',
        stop_order: 1,
    });

    const [assignmentForm, setAssignmentForm] = useState({
        player_id: '',
        bus_route_id: '',
        bus_stop_id: '',
    });

    const loadData = async () => {
        try {
            setLoading(true);

            const [
                busesResponse,
                routesResponse,
                assignmentsResponse,
                playersResponse,
            ] = await Promise.all([
                api.get('/admin/transportation/buses'),
                api.get('/admin/transportation/routes'),
                api.get('/admin/transportation/assignments'),
                api.get('/admin/players'),
            ]);

            setBuses(busesResponse.data.buses || []);
            setRoutes(routesResponse.data.routes || []);
            setAssignments(assignmentsResponse.data.assignments || []);
            setPlayers(
                playersResponse.data.players || playersResponse.data || []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to load transportation data.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const clearMessages = () => {
        setMessage('');
        setError('');
    };

    const handleBusSubmit = async (event) => {
        event.preventDefault();
        clearMessages();

        try {
            await api.post('/admin/transportation/buses', {
                ...busForm,
                capacity: Number(busForm.capacity),
            });

            setBusForm({
                bus_number: '',
                name: '',
                capacity: '',
                driver_name: '',
                driver_phone: '',
                departure_time: '',
            });

            setMessage('Bus added successfully.');
            loadData();
        } catch (err) {
            setError(
                err.response?.data?.message || 'Unable to add bus.'
            );
        }
    };

    const handleRouteSubmit = async (event) => {
        event.preventDefault();
        clearMessages();

        try {
            await api.post('/admin/transportation/routes', routeForm);

            setRouteForm({
                bus_id: '',
                name: '',
                area: '',
                departure_time: '',
                return_time: '',
            });

            setMessage('Route added successfully.');
            loadData();
        } catch (err) {
            setError(
                err.response?.data?.message || 'Unable to add route.'
            );
        }
    };

    const handleStopSubmit = async (event) => {
        event.preventDefault();
        clearMessages();

        try {
            const { route_id, ...data } = stopForm;

            await api.post(
                `/admin/transportation/routes/${route_id}/stops`,
                {
                    ...data,
                    stop_order: Number(data.stop_order),
                }
            );

            setStopForm({
                route_id: '',
                name: '',
                address: '',
                pickup_time: '',
                stop_order: 1,
            });

            setMessage('Stop added successfully.');
            loadData();
        } catch (err) {
            setError(
                err.response?.data?.message || 'Unable to add stop.'
            );
        }
    };

    const handleAssignmentSubmit = async (event) => {
        event.preventDefault();
        clearMessages();

        try {
            await api.post('/admin/transportation/assignments', {
                ...assignmentForm,
            });

            setAssignmentForm({
                player_id: '',
                bus_route_id: '',
                bus_stop_id: '',
            });

            setMessage('Player assigned successfully.');
            loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to assign player.'
            );
        }
    };

    const deleteBus = async (id) => {
        if (!window.confirm('Delete this bus?')) {
            return;
        }

        clearMessages();

        try {
            await api.delete(`/admin/transportation/buses/${id}`);
            setMessage('Bus deleted successfully.');
            loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to delete bus.'
            );
        }
    };

    const deleteRoute = async (id) => {
        if (!window.confirm('Delete this route?')) {
            return;
        }

        clearMessages();

        try {
            await api.delete(`/admin/transportation/routes/${id}`);
            setMessage('Route deleted successfully.');
            loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to delete route.'
            );
        }
    };

    const deleteStop = async (id) => {
        if (!window.confirm('Delete this stop?')) {
            return;
        }

        clearMessages();

        try {
            await api.delete(`/admin/transportation/stops/${id}`);
            setMessage('Stop deleted successfully.');
            loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to delete stop.'
            );
        }
    };

    const removeAssignment = async (id) => {
        if (!window.confirm('Remove this player from transportation?')) {
            return;
        }

        clearMessages();

        try {
            await api.delete(
                `/admin/transportation/assignments/${id}`
            );
            setMessage('Player removed successfully.');
            loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to remove player.'
            );
        }
    };

    const selectedRoute = routes.find(
        (route) =>
            String(route.id) ===
            String(assignmentForm.bus_route_id)
    );

    const availableStops = selectedRoute?.stops || [];

    if (loading) {
        return (
            <div className="admin-transportation-loading">
                Loading transportation...
            </div>
        );
    }

    return (
        <div className="admin-transportation-page">
            <div className="admin-transportation-header">
                <div>
                    <span>ACADEMY TRANSPORTATION</span>
                    <h1>Transportation Management</h1>
                    <p>
                        Manage buses, routes, stops and player
                        assignments.
                    </p>
                </div>
            </div>

            {message && (
                <div className="admin-transportation-success">
                    {message}
                </div>
            )}

            {error && (
                <div className="admin-transportation-error">
                    {error}
                </div>
            )}

            <div className="transportation-stats">
                <div>
                    <span>Buses</span>
                    <strong>{buses.length}</strong>
                </div>

                <div>
                    <span>Routes</span>
                    <strong>{routes.length}</strong>
                </div>

                <div>
                    <span>Stops</span>
                    <strong>
                        {routes.reduce(
                            (total, route) =>
                                total + (route.stops?.length || 0),
                            0
                        )}
                    </strong>
                </div>

                <div>
                    <span>Assignments</span>
                    <strong>{assignments.length}</strong>
                </div>
            </div>

            <div className="transportation-tabs">
                <button
                    type="button"
                    className={
                        activeTab === 'buses' ? 'active' : ''
                    }
                    onClick={() => setActiveTab('buses')}
                >
                    Buses
                </button>

                <button
                    type="button"
                    className={
                        activeTab === 'routes' ? 'active' : ''
                    }
                    onClick={() => setActiveTab('routes')}
                >
                    Routes
                </button>

                <button
                    type="button"
                    className={
                        activeTab === 'stops' ? 'active' : ''
                    }
                    onClick={() => setActiveTab('stops')}
                >
                    Stops
                </button>

                <button
                    type="button"
                    className={
                        activeTab === 'assignments' ? 'active' : ''
                    }
                    onClick={() => setActiveTab('assignments')}
                >
                    Assignments
                </button>
            </div>

            {activeTab === 'buses' && (
                <section className="transportation-section">
                    <div className="transportation-card">
                        <div className="transportation-card-title">
                            <span>NEW BUS</span>
                            <h2>Add Bus</h2>
                        </div>

                        <form
                            onSubmit={handleBusSubmit}
                            className="transportation-form"
                        >
                            <input
                                placeholder="Bus number"
                                value={busForm.bus_number}
                                onChange={(e) =>
                                    setBusForm({
                                        ...busForm,
                                        bus_number: e.target.value,
                                    })
                                }
                                required
                            />

                            <input
                                placeholder="Bus name"
                                value={busForm.name}
                                onChange={(e) =>
                                    setBusForm({
                                        ...busForm,
                                        name: e.target.value,
                                    })
                                }
                            />

                            <input
                                type="number"
                                min="1"
                                placeholder="Capacity"
                                value={busForm.capacity}
                                onChange={(e) =>
                                    setBusForm({
                                        ...busForm,
                                        capacity: e.target.value,
                                    })
                                }
                                required
                            />

                            <input
                                placeholder="Driver name"
                                value={busForm.driver_name}
                                onChange={(e) =>
                                    setBusForm({
                                        ...busForm,
                                        driver_name: e.target.value,
                                    })
                                }
                            />

                            <input
                                placeholder="Driver phone"
                                value={busForm.driver_phone}
                                onChange={(e) =>
                                    setBusForm({
                                        ...busForm,
                                        driver_phone: e.target.value,
                                    })
                                }
                            />

                            <input
                                type="time"
                                value={busForm.departure_time}
                                onChange={(e) =>
                                    setBusForm({
                                        ...busForm,
                                        departure_time: e.target.value,
                                    })
                                }
                            />

                            <button type="submit">Add Bus</button>
                        </form>
                    </div>

                    <div className="transportation-list">
                        {buses.map((bus) => (
                            <div
                                className="transportation-item"
                                key={bus.id}
                            >
                                <div>
                                    <strong>{bus.bus_number}</strong>
                                    <span>
                                        {bus.name || 'Academy Bus'}
                                    </span>
                                </div>

                                <div>
                                    <span>Capacity</span>
                                    <strong>{bus.capacity}</strong>
                                </div>

                                <div>
                                    <span>Driver</span>
                                    <strong>
                                        {bus.driver_name ||
                                            'Not assigned'}
                                    </strong>
                                </div>

                                <div>
                                    <span>Routes</span>
                                    <strong>
                                        {bus.routes_count}
                                    </strong>
                                </div>

                                <button
                                    type="button"
                                    className="danger-button"
                                    onClick={() =>
                                        deleteBus(bus.id)
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {activeTab === 'routes' && (
                <section className="transportation-section">
                    <div className="transportation-card">
                        <div className="transportation-card-title">
                            <span>NEW ROUTE</span>
                            <h2>Add Route</h2>
                        </div>

                        <form
                            onSubmit={handleRouteSubmit}
                            className="transportation-form"
                        >
                            <select
                                value={routeForm.bus_id}
                                onChange={(e) =>
                                    setRouteForm({
                                        ...routeForm,
                                        bus_id: e.target.value,
                                    })
                                }
                                required
                            >
                                <option value="">
                                    Select bus
                                </option>

                                {buses.map((bus) => (
                                    <option
                                        key={bus.id}
                                        value={bus.id}
                                    >
                                        {bus.bus_number}
                                    </option>
                                ))}
                            </select>

                            <input
                                placeholder="Route name"
                                value={routeForm.name}
                                onChange={(e) =>
                                    setRouteForm({
                                        ...routeForm,
                                        name: e.target.value,
                                    })
                                }
                                required
                            />

                            <input
                                placeholder="Area"
                                value={routeForm.area}
                                onChange={(e) =>
                                    setRouteForm({
                                        ...routeForm,
                                        area: e.target.value,
                                    })
                                }
                            />

                            <input
                                type="time"
                                value={routeForm.departure_time}
                                onChange={(e) =>
                                    setRouteForm({
                                        ...routeForm,
                                        departure_time:
                                            e.target.value,
                                    })
                                }
                            />

                            <input
                                type="time"
                                value={routeForm.return_time}
                                onChange={(e) =>
                                    setRouteForm({
                                        ...routeForm,
                                        return_time:
                                            e.target.value,
                                    })
                                }
                            />

                            <button type="submit">
                                Add Route
                            </button>
                        </form>
                    </div>

                    <div className="transportation-list">
                        {routes.map((route) => (
                            <div
                                className="transportation-item"
                                key={route.id}
                            >
                                <div>
                                    <strong>{route.name}</strong>
                                    <span>
                                        {route.area || 'No area'}
                                    </span>
                                </div>

                                <div>
                                    <span>Bus</span>
                                    <strong>
                                        {route.bus?.bus_number}
                                    </strong>
                                </div>

                                <div>
                                    <span>Departure</span>
                                    <strong>
                                        {route.departure_time || '--'}
                                    </strong>
                                </div>

                                <div>
                                    <span>Stops</span>
                                    <strong>
                                        {route.stops?.length || 0}
                                    </strong>
                                </div>

                                <button
                                    type="button"
                                    className="danger-button"
                                    onClick={() =>
                                        deleteRoute(route.id)
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {activeTab === 'stops' && (
                <section className="transportation-section">
                    <div className="transportation-card">
                        <div className="transportation-card-title">
                            <span>NEW STOP</span>
                            <h2>Add Stop</h2>
                        </div>

                        <form
                            onSubmit={handleStopSubmit}
                            className="transportation-form"
                        >
                            <select
                                value={stopForm.route_id}
                                onChange={(e) =>
                                    setStopForm({
                                        ...stopForm,
                                        route_id: e.target.value,
                                    })
                                }
                                required
                            >
                                <option value="">
                                    Select route
                                </option>

                                {routes.map((route) => (
                                    <option
                                        key={route.id}
                                        value={route.id}
                                    >
                                        {route.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                placeholder="Stop name"
                                value={stopForm.name}
                                onChange={(e) =>
                                    setStopForm({
                                        ...stopForm,
                                        name: e.target.value,
                                    })
                                }
                                required
                            />

                            <input
                                placeholder="Address"
                                value={stopForm.address}
                                onChange={(e) =>
                                    setStopForm({
                                        ...stopForm,
                                        address: e.target.value,
                                    })
                                }
                            />

                            <input
                                type="time"
                                value={stopForm.pickup_time}
                                onChange={(e) =>
                                    setStopForm({
                                        ...stopForm,
                                        pickup_time:
                                            e.target.value,
                                    })
                                }
                            />

                            <input
                                type="number"
                                min="1"
                                placeholder="Order"
                                value={stopForm.stop_order}
                                onChange={(e) =>
                                    setStopForm({
                                        ...stopForm,
                                        stop_order: e.target.value,
                                    })
                                }
                                required
                            />

                            <button type="submit">
                                Add Stop
                            </button>
                        </form>
                    </div>

                    <div className="transportation-list">
                        {routes.flatMap((route) =>
                            (route.stops || []).map((stop) => (
                                <div
                                    className="transportation-item"
                                    key={stop.id}
                                >
                                    <div>
                                        <strong>
                                            {stop.name}
                                        </strong>
                                        <span>
                                            {route.name}
                                        </span>
                                    </div>

                                    <div>
                                        <span>Address</span>
                                        <strong>
                                            {stop.address || '--'}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Pickup</span>
                                        <strong>
                                            {stop.pickup_time ||
                                                '--'}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Order</span>
                                        <strong>
                                            {stop.stop_order}
                                        </strong>
                                    </div>

                                    <button
                                        type="button"
                                        className="danger-button"
                                        onClick={() =>
                                            deleteStop(stop.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            )}

            {activeTab === 'assignments' && (
                <section className="transportation-section">
                    <div className="transportation-card">
                        <div className="transportation-card-title">
                            <span>PLAYER TRANSPORT</span>
                            <h2>Assign Player</h2>
                        </div>

                        <form
                            onSubmit={handleAssignmentSubmit}
                            className="transportation-form"
                        >
                            <select
                                value={
                                    assignmentForm.player_id
                                }
                                onChange={(e) =>
                                    setAssignmentForm({
                                        ...assignmentForm,
                                        player_id:
                                            e.target.value,
                                    })
                                }
                                required
                            >
                                <option value="">
                                    Select player
                                </option>

                                {players.map((player) => (
                                    <option
                                        key={player.id}
                                        value={player.id}
                                    >
                                        {player.first_name}{' '}
                                        {player.last_name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={
                                    assignmentForm.bus_route_id
                                }
                                onChange={(e) =>
                                    setAssignmentForm({
                                        ...assignmentForm,
                                        bus_route_id:
                                            e.target.value,
                                        bus_stop_id: '',
                                    })
                                }
                                required
                            >
                                <option value="">
                                    Select route
                                </option>

                                {routes.map((route) => (
                                    <option
                                        key={route.id}
                                        value={route.id}
                                    >
                                        {route.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={
                                    assignmentForm.bus_stop_id
                                }
                                onChange={(e) =>
                                    setAssignmentForm({
                                        ...assignmentForm,
                                        bus_stop_id:
                                            e.target.value,
                                    })
                                }
                                required
                                disabled={
                                    !assignmentForm.bus_route_id
                                }
                            >
                                <option value="">
                                    Select stop
                                </option>

                                {availableStops.map((stop) => (
                                    <option
                                        key={stop.id}
                                        value={stop.id}
                                    >
                                        {stop.name}
                                    </option>
                                ))}
                            </select>

                            <button type="submit">
                                Assign Player
                            </button>
                        </form>
                    </div>

                    <div className="transportation-list">
                        {assignments.map((assignment) => (
                            <div
                                className="transportation-item"
                                key={assignment.id}
                            >
                                <div>
                                    <strong>
                                        {
                                            assignment.player
                                                ?.first_name
                                        }{' '}
                                        {
                                            assignment.player
                                                ?.last_name
                                        }
                                    </strong>
                                    <span>
                                        {assignment.route?.name}
                                    </span>
                                </div>

                                <div>
                                    <span>Bus</span>
                                    <strong>
                                        {
                                            assignment.route?.bus
                                                ?.bus_number
                                        }
                                    </strong>
                                </div>

                                <div>
                                    <span>Stop</span>
                                    <strong>
                                        {assignment.stop?.name}
                                    </strong>
                                </div>

                                <div>
                                    <span>Pickup</span>
                                    <strong>
                                        {assignment.stop
                                            ?.pickup_time || '--'}
                                    </strong>
                                </div>

                                <button
                                    type="button"
                                    className="danger-button"
                                    onClick={() =>
                                        removeAssignment(
                                            assignment.id
                                        )
                                    }
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}