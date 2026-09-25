import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './RegisterPlayer.css';

export default function RegisterPlayer() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        academy_id: 1,
        age_group_id: '',
        uniform_size_id: '',
        jersey_number_id: '',
        needs_transportation: false,
        transportation_route_id: '',
    });

    const [ageGroups, setAgeGroups] = useState([]);
    const [uniformSizes, setUniformSizes] = useState([]);
    const [availableNumbers, setAvailableNumbers] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loadingNumbers, setLoadingNumbers] = useState(false);
    const [loadingRoutes, setLoadingRoutes] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAgeGroups = async () => {
            try {
                const response = await api.get('/age-groups');
                const data = response.data;

                if (Array.isArray(data)) {
                    setAgeGroups(data);
                } else if (Array.isArray(data?.age_groups)) {
                    setAgeGroups(data.age_groups);
                } else if (Array.isArray(data?.data)) {
                    setAgeGroups(data.data);
                } else {
                    setAgeGroups([]);
                }
            } catch (err) {
                setAgeGroups([]);
                setError(
                    err.response?.data?.message ||
                        'Unable to load age groups.'
                );
            }
        };

        const fetchUniformSizes = async () => {
            try {
                const response = await api.get('/uniform/sizes');
                const data = response.data;

                if (Array.isArray(data)) {
                    setUniformSizes(data);
                } else if (Array.isArray(data?.uniform_sizes)) {
                    setUniformSizes(data.uniform_sizes);
                } else if (Array.isArray(data?.data)) {
                    setUniformSizes(data.data);
                } else {
                    setUniformSizes([]);
                }
            } catch (err) {
                setUniformSizes([]);
            }
        };

        const fetchRoutes = async () => {
            setLoadingRoutes(true);

            try {
                const response = await api.get('/transportation/routes');
                const data = response.data;

                if (Array.isArray(data)) {
                    setRoutes(data);
                } else if (Array.isArray(data?.routes)) {
                    setRoutes(data.routes);
                } else if (Array.isArray(data?.bus_routes)) {
                    setRoutes(data.bus_routes);
                } else if (Array.isArray(data?.data)) {
                    setRoutes(data.data);
                } else {
                    setRoutes([]);
                }
            } catch (err) {
                setRoutes([]);
            } finally {
                setLoadingRoutes(false);
            }
        };

        fetchAgeGroups();
        fetchUniformSizes();
        fetchRoutes();
    }, []);

    useEffect(() => {
        if (!formData.age_group_id) {
            setAvailableNumbers([]);
            return;
        }

        const fetchAvailableNumbers = async () => {
            setLoadingNumbers(true);
            setAvailableNumbers([]);

            setFormData((prev) => ({
                ...prev,
                jersey_number_id: '',
            }));

            try {
                const response = await api.get(
                    `/jersey-numbers/available?age_group_id=${formData.age_group_id}`
                );

                const data = response.data;

                if (Array.isArray(data?.jersey_numbers)) {
                    setAvailableNumbers(data.jersey_numbers);
                } else if (Array.isArray(data)) {
                    setAvailableNumbers(data);
                } else {
                    setAvailableNumbers([]);
                }
            } catch (err) {
                setAvailableNumbers([]);
            } finally {
                setLoadingNumbers(false);
            }
        };

        fetchAvailableNumbers();
    }, [formData.age_group_id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => {
            const updatedData = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            };

            if (
                name === 'needs_transportation' &&
                !checked
            ) {
                updatedData.transportation_route_id = '';
            }

            return updatedData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const nameParts = formData.first_name.trim().split(/\s+/);

            const firstName = nameParts.shift();
            const lastName = nameParts.join(' ') || firstName;

            const payload = {
                academy_id: 1,
                age_group_id: formData.age_group_id
                    ? Number(formData.age_group_id)
                    : null,
                first_name: firstName,
                last_name: lastName,
                date_of_birth: formData.date_of_birth,
                uniform_size_id: formData.uniform_size_id
                    ? Number(formData.uniform_size_id)
                    : null,
                jersey_number_id: formData.jersey_number_id
                    ? Number(formData.jersey_number_id)
                    : null,
                needs_transportation: formData.needs_transportation,
                transportation_route_id:
                    formData.needs_transportation &&
                    formData.transportation_route_id
                        ? Number(formData.transportation_route_id)
                        : null,
            };

            await api.post('/players', payload);

            navigate('/parent/dashboard');
        } catch (err) {
            const validationErrors = err.response?.data?.errors;

            if (validationErrors) {
                const firstError = Object.values(validationErrors)[0];

                setError(
                    Array.isArray(firstError)
                        ? firstError[0]
                        : 'Please check the entered information.'
                );
            } else {
                setError(
                    err.response?.data?.message ||
                        'Failed to register player.'
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="register-player-page">
            <div className="register-player-container">
                <div className="register-player-header">
                    <span>PLAYER REGISTRATION</span>
                    <h1>Register New Player</h1>
                    <p>
                        Add your player to FAW Football Academy and choose
                        their academy details.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="register-player-form"
                >
                    {error && (
                        <div className="register-player-error">
                            {error}
                        </div>
                    )}

                    <section className="register-player-section">
                        <div className="register-player-section-title">
                            <div className="register-player-section-number">
                                1
                            </div>

                            <h2>Player Information</h2>
                        </div>

                        <div className="register-player-grid">
                            <div className="register-player-field full">
                                <label>Player Full Name</label>

                                <input
                                    type="text"
                                    name="first_name"
                                    required
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    placeholder="Enter player's full name"
                                />
                            </div>

                            <div className="register-player-field">
                                <label>Date of Birth</label>

                                <input
                                    type="date"
                                    name="date_of_birth"
                                    required
                                    value={formData.date_of_birth}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="register-player-field">
                                <label>Age Group</label>

                                <select
                                    name="age_group_id"
                                    required
                                    value={formData.age_group_id}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        Select Age Group
                                    </option>

                                    {ageGroups.map((group) => (
                                        <option
                                            key={group.id}
                                            value={group.id}
                                        >
                                            {group.name} ({group.min_age} -{' '}
                                            {group.max_age} years)
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="register-player-section">
                        <div className="register-player-section-title">
                            <div className="register-player-section-number">
                                2
                            </div>

                            <h2>Academy Kit</h2>
                        </div>

                        <div className="register-player-grid">
                            <div className="register-player-field">
                                <label>Uniform Size</label>

                                <select
                                    name="uniform_size_id"
                                    value={formData.uniform_size_id}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        Select Uniform Size
                                    </option>

                                    {uniformSizes.map((size) => (
                                        <option
                                            key={size.id}
                                            value={size.id}
                                        >
                                            {size.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="register-player-field">
                                <label>Jersey Number</label>

                                <select
                                    name="jersey_number_id"
                                    required
                                    disabled={
                                        !formData.age_group_id ||
                                        loadingNumbers
                                    }
                                    value={formData.jersey_number_id}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        {loadingNumbers
                                            ? 'Loading numbers...'
                                            : !formData.age_group_id
                                            ? 'Select Age Group First'
                                            : 'Select Number'}
                                    </option>

                                    {availableNumbers.map((num) => (
                                        <option
                                            key={num.id}
                                            value={num.id}
                                        >
                                            #{num.number}
                                        </option>
                                    ))}
                                </select>

                                {formData.age_group_id &&
                                    !loadingNumbers && (
                                        <div className="register-player-number-info">
                                            {availableNumbers.length > 0 ? (
                                                <>
                                                    <strong>
                                                        {
                                                            availableNumbers.length
                                                        }
                                                    </strong>{' '}
                                                    jersey numbers available
                                                </>
                                            ) : (
                                                'No jersey numbers available'
                                            )}
                                        </div>
                                    )}
                            </div>
                        </div>
                    </section>

                    <section className="register-player-section">
                        <div className="register-player-section-title">
                            <div className="register-player-section-number">
                                3
                            </div>

                            <h2>Transportation</h2>
                        </div>

                        <div className="register-player-transport-box">
                            <label className="register-player-transport-label">
                                <input
                                    type="checkbox"
                                    name="needs_transportation"
                                    checked={
                                        formData.needs_transportation
                                    }
                                    onChange={handleChange}
                                />

                                <span>
                                    Request Bus Transportation
                                </span>
                            </label>

                            {formData.needs_transportation && (
                                <div className="register-player-route">
                                    <div className="register-player-field">
                                        <label>
                                            Transportation Route / Area
                                        </label>

                                        <select
                                            name="transportation_route_id"
                                            required
                                            value={
                                                formData.transportation_route_id
                                            }
                                            onChange={handleChange}
                                            disabled={loadingRoutes}
                                        >
                                            <option value="">
                                                {loadingRoutes
                                                    ? 'Loading transportation routes...'
                                                    : routes.length === 0
                                                    ? 'No transportation routes available'
                                                    : 'Select Transportation Route'}
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
                                    </div>

                                    {routes.length > 0 &&
                                        !loadingRoutes && (
                                            <div className="register-player-number-info">
                                                <strong>
                                                    {routes.length}
                                                </strong>{' '}
                                                transportation routes available
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>
                    </section>

                    <div className="register-player-actions">
                        <button
                            type="button"
                            className="register-player-button cancel"
                            onClick={() =>
                                navigate('/parent/dashboard')
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="register-player-button submit"
                            disabled={submitting}
                        >
                            {submitting
                                ? 'Registering...'
                                : 'Complete Registration'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}