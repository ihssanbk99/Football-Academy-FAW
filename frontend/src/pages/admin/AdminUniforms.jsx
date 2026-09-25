import { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminUniforms.css';

function AdminUniforms() {
    const standardSizes = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

    const [sizes, setSizes] = useState([]);
    const [numbers, setNumbers] = useState([]);
    const [ageGroups, setAgeGroups] = useState([]);

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [selectedAgeGroup, setSelectedAgeGroup] = useState('');

    const [number, setNumber] = useState('');
    const [ageGroupId, setAgeGroupId] = useState('');

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);

            const [sizesResponse, numbersResponse, ageGroupsResponse] =
                await Promise.all([
                    api.get('/admin/uniform/sizes'),
                    api.get('/admin/uniform/numbers'),
                    api.get('/admin/age-groups'),
                ]);

            setSizes(sizesResponse.data.uniform_sizes || []);
            setNumbers(numbersResponse.data.jersey_numbers || []);
            setAgeGroups(ageGroupsResponse.data.age_groups || []);
            setError('');
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to load uniform data.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddNumber = async (event) => {
        event.preventDefault();

        try {
            setMessage('');
            setError('');

            await api.post('/admin/uniform/numbers', {
                number: Number(number),
                age_group_id: ageGroupId || null,
            });

            setNumber('');
            setAgeGroupId('');
            setMessage('Jersey number added successfully.');
            fetchData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to add jersey number.'
            );
        }
    };

    const handleToggleNumber = async (item) => {
        try {
            setMessage('');
            setError('');

            await api.patch(`/admin/uniform/numbers/${item.id}`, {
                number: item.number,
                age_group_id: item.age_group_id,
                is_active: !item.is_active,
            });

            setMessage('Jersey number updated successfully.');
            fetchData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to update jersey number.'
            );
        }
    };

    const handleDeleteNumber = async (id) => {
        if (!window.confirm('Delete this jersey number?')) {
            return;
        }

        try {
            setMessage('');
            setError('');

            await api.delete(`/admin/uniform/numbers/${id}`);

            setMessage('Jersey number deleted successfully.');
            fetchData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to delete jersey number.'
            );
        }
    };

    const filteredNumbers = numbers
        .filter((item) => {
            if (!selectedAgeGroup) {
                return true;
            }

            return String(item.age_group_id) === String(selectedAgeGroup);
        })
        .sort((a, b) => a.number - b.number);

    const numberMap = new Map(
        filteredNumbers.map((item) => [Number(item.number), item])
    );

    return (
        <div className="admin-uniform-page">
            <div className="admin-uniform-header">
                <span>TEAM EQUIPMENT</span>
                <h1>Uniforms & Jersey Numbers</h1>
                <p>
                    Select uniform sizes and available jersey numbers for
                    academy players.
                </p>
            </div>

            {message && (
                <div className="admin-uniform-success">
                    {message}
                </div>
            )}

            {error && (
                <div className="admin-uniform-error">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="admin-uniform-loading">
                    Loading uniform management...
                </div>
            ) : (
                <div className="admin-uniform-layout">
                    <section className="admin-uniform-card">
                        <div className="admin-uniform-card-header">
                            <div>
                                <span>UNIFORM SIZE</span>
                                <h2>Select Size</h2>
                            </div>

                            <strong>{selectedSize || '—'}</strong>
                        </div>

                        <div className="uniform-size-grid">
                            {standardSizes.map((size) => {
                                const databaseSize = sizes.find(
                                    (item) =>
                                        item.name.toUpperCase() ===
                                        size
                                );

                                const disabled =
                                    databaseSize &&
                                    !databaseSize.is_active;

                                return (
                                    <button
                                        key={size}
                                        type="button"
                                        disabled={disabled}
                                        className={`uniform-size-box ${
                                            selectedSize === size
                                                ? 'selected'
                                                : ''
                                        } ${
                                            disabled
                                                ? 'disabled'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            setSelectedSize(size)
                                        }
                                    >
                                        <span>{size}</span>

                                        {selectedSize === size && (
                                            <small>✓</small>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="selection-preview">
                            <span>SELECTED SIZE</span>
                            <strong>
                                {selectedSize || 'Choose a size'}
                            </strong>
                        </div>
                    </section>

                    <section className="admin-uniform-card">
                        <div className="admin-uniform-card-header">
                            <div>
                                <span>JERSEY NUMBER</span>
                                <h2>Select Number</h2>
                            </div>

                            <strong>
                                {selectedNumber || '—'}
                            </strong>
                        </div>

                        <div className="admin-number-filter">
                            <label>AGE GROUP</label>

                            <select
                                value={selectedAgeGroup}
                                onChange={(event) => {
                                    setSelectedAgeGroup(
                                        event.target.value
                                    );
                                    setSelectedNumber(null);
                                }}
                            >
                                <option value="">
                                    All Age Groups
                                </option>

                                {ageGroups.map((group) => (
                                    <option
                                        key={group.id}
                                        value={group.id}
                                    >
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="jersey-number-grid">
                            {Array.from(
                                { length: 99 },
                                (_, index) => index + 1
                            ).map((numberValue) => {
                                const item =
                                    numberMap.get(numberValue);

                                const isUsed =
                                    item?.player_count > 0;

                                const isInactive =
                                    item && !item.is_active;

                                const isUnavailable =
                                    isUsed || isInactive;

                                return (
                                    <button
                                        key={numberValue}
                                        type="button"
                                        disabled={isUnavailable}
                                        className={`jersey-number-box ${
                                            selectedNumber ===
                                            numberValue
                                                ? 'selected'
                                                : ''
                                        } ${
                                            isUsed ? 'used' : ''
                                        } ${
                                            isInactive
                                                ? 'inactive'
                                                : ''
                                        } ${
                                            !item
                                                ? 'not-configured'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            setSelectedNumber(
                                                numberValue
                                            )
                                        }
                                    >
                                        <span>
                                            {numberValue}
                                        </span>

                                        {isUsed && (
                                            <small>USED</small>
                                        )}

                                        {!item && (
                                            <small>—</small>
                                        )}

                                        {isInactive && (
                                            <small>OFF</small>
                                        )}

                                        {selectedNumber ===
                                            numberValue && (
                                            <b>✓</b>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="selection-preview">
                            <span>SELECTED NUMBER</span>
                            <strong>
                                {selectedNumber
                                    ? `#${selectedNumber}`
                                    : 'Choose a number'}
                            </strong>
                        </div>

                        <div className="admin-number-management">
                            <form
                                className="admin-number-add-form"
                                onSubmit={handleAddNumber}
                            >
                                <input
                                    type="number"
                                    min="1"
                                    max="99"
                                    value={number}
                                    onChange={(event) =>
                                        setNumber(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Number"
                                    required
                                />

                                <select
                                    value={ageGroupId}
                                    onChange={(event) =>
                                        setAgeGroupId(
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        All Age Groups
                                    </option>

                                    {ageGroups.map((group) => (
                                        <option
                                            key={group.id}
                                            value={group.id}
                                        >
                                            {group.name}
                                        </option>
                                    ))}
                                </select>

                                <button type="submit">
                                    Add Number
                                </button>
                            </form>

                            <div className="admin-number-management-list">
                                {numbers.map((item) => (
                                    <div
                                        key={item.id}
                                        className="admin-number-management-item"
                                    >
                                        <span>
                                            #{item.number}
                                        </span>

                                        <small>
                                            {item.age_group?.name ||
                                                'All Groups'}
                                        </small>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleToggleNumber(
                                                    item
                                                )
                                            }
                                        >
                                            {item.is_active
                                                ? 'Disable'
                                                : 'Enable'}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteNumber(
                                                    item.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

export default AdminUniforms;