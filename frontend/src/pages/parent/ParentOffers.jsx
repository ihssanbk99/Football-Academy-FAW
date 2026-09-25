import { useEffect, useState } from 'react';
import api from '../../services/api';
import './ParentOffers.css';

export default function ParentOffers() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/offers')
            .then((response) => {
                setOffers(response.data.offers || []);
            })
            .catch((err) => {
                setError(
                    err.response?.data?.message ||
                    'Unable to load offers.'
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const formatDate = (date) => {
        if (!date) {
            return 'No expiry';
        }

        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="parent-offers-state">
                <div className="parent-offers-spinner"></div>
                <h2>Loading offers...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="parent-offers-state">
                <h2>Unable to load offers</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="parent-offers-page">
            <section className="parent-offers-hero">
                <div>
                    <span>FAW SPECIAL PROMOTIONS</span>
                    <h1>Offers & Discounts</h1>
                    <p>
                        Take advantage of our latest academy promotions and
                        special seasonal offers.
                    </p>
                </div>

                <div className="parent-offers-hero-icon">%</div>
            </section>

            {offers.length === 0 ? (
                <div className="parent-offers-state">
                    <div className="parent-offers-empty-icon">%</div>
                    <h2>No active offers</h2>
                    <p>
                        New academy promotions will appear here when
                        available.
                    </p>
                </div>
            ) : (
                <section className="parent-offers-grid">
                    {offers.map((offer) => (
                        <article
                            className="parent-offer-card"
                            key={offer.id}
                        >
                            <div className="parent-offer-discount">
                                <strong>
                                    {Number(
                                        offer.discount_percentage
                                    )}
                                    %
                                </strong>
                                <span>OFF</span>
                            </div>

                            <div className="parent-offer-content">
                                <span>SPECIAL OFFER</span>

                                <h2>{offer.title}</h2>

                                {offer.subtitle && (
                                    <h3>{offer.subtitle}</h3>
                                )}

                                {offer.description && (
                                    <p>{offer.description}</p>
                                )}

                                {offer.code && (
                                    <div className="parent-offer-code">
                                        Use Code:
                                        <strong>{offer.code}</strong>
                                    </div>
                                )}

                                <div className="parent-offer-expiry">
                                    Valid until{' '}
                                    <strong>
                                        {formatDate(offer.end_date)}
                                    </strong>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </div>
    );
}