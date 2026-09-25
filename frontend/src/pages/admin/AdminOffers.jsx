import { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminOffers.css';

export default function AdminOffers() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        title: '',
        subtitle: '',
        description: '',
        discount_percentage: '',
        start_date: '',
        end_date: '',
        code: '',
        is_active: true,
    });

    const fetchOffers = async () => {
        try {
            const response = await api.get('/admin/offers');
            setOffers(response.data.offers || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load offers.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    const resetForm = () => {
        setForm({
            title: '',
            subtitle: '',
            description: '',
            discount_percentage: '',
            start_date: '',
            end_date: '',
            code: '',
            is_active: true,
        });

        setEditingId(null);
        setShowForm(false);
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setForm((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            if (editingId) {
                const response = await api.patch(
                    `/admin/offers/${editingId}`,
                    form
                );

                setOffers((current) =>
                    current.map((offer) =>
                        offer.id === editingId
                            ? response.data.offer
                            : offer
                    )
                );
            } else {
                const response = await api.post('/admin/offers', form);

                setOffers((current) => [
                    response.data.offer,
                    ...current,
                ]);
            }

            resetForm();
        } catch (err) {
            const validationErrors = err.response?.data?.errors;

            if (validationErrors) {
                const firstError = Object.values(validationErrors)[0]?.[0];
                setError(firstError || 'Unable to save offer.');
            } else {
                setError(
                    err.response?.data?.message ||
                    'Unable to save offer.'
                );
            }
        }
    };

    const handleEdit = (offer) => {
        setEditingId(offer.id);

        setForm({
            title: offer.title || '',
            subtitle: offer.subtitle || '',
            description: offer.description || '',
            discount_percentage: offer.discount_percentage || '',
            start_date: offer.start_date
                ? offer.start_date.slice(0, 10)
                : '',
            end_date: offer.end_date
                ? offer.end_date.slice(0, 10)
                : '',
            code: offer.code || '',
            is_active: Boolean(offer.is_active),
        });

        setShowForm(true);
        setError('');
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this offer?'
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/admin/offers/${id}`);

            setOffers((current) =>
                current.filter((offer) => offer.id !== id)
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to delete offer.'
            );
        }
    };

    const toggleStatus = async (offer) => {
        try {
            const response = await api.patch(
                `/admin/offers/${offer.id}`,
                {
                    is_active: !offer.is_active,
                }
            );

            setOffers((current) =>
                current.map((item) =>
                    item.id === offer.id
                        ? response.data.offer
                        : item
                )
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to update offer status.'
            );
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return 'No date';
        }

        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="admin-offers-page">
            <section className="admin-offers-hero">
                <div>
                    <span>ACADEMY PROMOTIONS</span>
                    <h1>Offers & Discounts</h1>
                    <p>
                        Create seasonal promotions, special discounts,
                        and academy campaigns.
                    </p>
                </div>

                <div className="admin-offers-hero-icon">%</div>
            </section>

            <section className="admin-offers-toolbar">
                <div>
                    <span>TOTAL OFFERS</span>
                    <strong>{offers.length}</strong>
                </div>

                <div>
                    <span>ACTIVE OFFERS</span>
                    <strong>
                        {offers.filter((offer) => offer.is_active).length}
                    </strong>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        if (showForm) {
                            resetForm();
                        } else {
                            setShowForm(true);
                        }
                    }}
                >
                    {showForm ? 'Close Form' : 'Create Offer'}
                </button>
            </section>

            {showForm && (
                <form
                    className="admin-offers-form"
                    onSubmit={handleSubmit}
                >
                    <div className="admin-offers-form-grid">
                        <div>
                            <label>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Summer Training Offer"
                                required
                            />
                        </div>

                        <div>
                            <label>Subtitle</label>
                            <input
                                type="text"
                                name="subtitle"
                                value={form.subtitle}
                                onChange={handleChange}
                                placeholder="Limited time promotion"
                            />
                        </div>

                        <div>
                            <label>Discount Percentage</label>
                            <input
                                type="number"
                                name="discount_percentage"
                                value={form.discount_percentage}
                                onChange={handleChange}
                                min="0.01"
                                max="100"
                                step="0.01"
                                placeholder="20"
                                required
                            />
                        </div>

                        <div>
                            <label>Discount Code</label>
                            <input
                                type="text"
                                name="code"
                                value={form.code}
                                onChange={handleChange}
                                placeholder="SUMMER20"
                            />
                        </div>

                        <div>
                            <label>Start Date</label>
                            <input
                                type="date"
                                name="start_date"
                                value={form.start_date}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>End Date</label>
                            <input
                                type="date"
                                name="end_date"
                                value={form.end_date}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="admin-offers-form-full">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe the offer..."
                                rows="4"
                            ></textarea>
                        </div>

                        <label className="admin-offers-checkbox">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={form.is_active}
                                onChange={handleChange}
                            />
                            <span>Offer is active</span>
                        </label>
                    </div>

                    <div className="admin-offers-form-actions">
                        <button type="submit">
                            {editingId
                                ? 'Update Offer'
                                : 'Create Offer'}
                        </button>

                        <button
                            type="button"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {error && (
                <div className="admin-offers-error">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="admin-offers-state">
                    <div className="admin-offers-spinner"></div>
                    <h2>Loading offers...</h2>
                </div>
            ) : offers.length === 0 ? (
                <div className="admin-offers-state">
                    <div className="admin-offers-state-icon">%</div>
                    <h2>No offers yet</h2>
                    <p>Create your first academy promotion.</p>
                </div>
            ) : (
                <section className="admin-offers-grid">
                    {offers.map((offer) => (
                        <article
                            className={`admin-offer-card ${
                                offer.is_active ? '' : 'inactive'
                            }`}
                            key={offer.id}
                        >
                            <div className="admin-offer-card-top">
                                <div className="admin-offer-discount">
                                    <strong>
                                        {Number(
                                            offer.discount_percentage
                                        )}
                                        %
                                    </strong>
                                    <span>OFF</span>
                                </div>

                                <span
                                    className={`admin-offer-status ${
                                        offer.is_active
                                            ? 'active'
                                            : 'inactive'
                                    }`}
                                >
                                    {offer.is_active
                                        ? 'Active'
                                        : 'Inactive'}
                                </span>
                            </div>

                            <div className="admin-offer-content">
                                <span className="admin-offer-label">
                                    SPECIAL OFFER
                                </span>

                                <h2>{offer.title}</h2>

                                {offer.subtitle && (
                                    <h3>{offer.subtitle}</h3>
                                )}

                                {offer.description && (
                                    <p>{offer.description}</p>
                                )}

                                <div className="admin-offer-details">
                                    <div>
                                        <span>VALID FROM</span>
                                        <strong>
                                            {formatDate(
                                                offer.start_date
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>VALID UNTIL</span>
                                        <strong>
                                            {formatDate(
                                                offer.end_date
                                            )}
                                        </strong>
                                    </div>
                                </div>

                                {offer.code && (
                                    <div className="admin-offer-code">
                                        <span>CODE</span>
                                        <strong>{offer.code}</strong>
                                    </div>
                                )}
                            </div>

                            <div className="admin-offer-actions">
                                <button
                                    type="button"
                                    onClick={() => handleEdit(offer)}
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        toggleStatus(offer)
                                    }
                                >
                                    {offer.is_active
                                        ? 'Deactivate'
                                        : 'Activate'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDelete(offer.id)
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </div>
    );
}