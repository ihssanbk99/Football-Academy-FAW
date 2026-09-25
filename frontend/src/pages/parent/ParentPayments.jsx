import { useEffect, useState } from 'react';
import api from '../../services/api';
import './ParentPayments.css';

export default function ParentPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await api.get('/payments');
                setPayments(response.data.payments || []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load payments.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const formatDate = (date) => {
        if (!date) {
            return 'Not available';
        }

        return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatAmount = (amount, currency) => {
        return `${Number(amount).toFixed(2)} ${currency || 'JOD'}`;
    };

    const formatStatus = (status) => {
        if (!status) {
            return 'Pending';
        }

        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const totalPaid = payments
        .filter((payment) => payment.status === 'paid')
        .reduce((total, payment) => total + Number(payment.amount), 0);

    const totalPending = payments
        .filter((payment) => payment.status === 'pending')
        .reduce((total, payment) => total + Number(payment.amount), 0);

    return (
        <div className="parent-payments-page">
            <section className="parent-payments-hero">
                <div>
                    <span>FINANCIAL CENTER</span>

                    <h1>Payments</h1>

                    <p>
                        View your players' academy payments, balances and
                        payment history.
                    </p>
                </div>

                <div className="parent-payments-symbol">
                    $
                </div>
            </section>

            <section className="parent-payments-summary">
                <div>
                    <span>TOTAL PAYMENTS</span>
                    <strong>{payments.length}</strong>
                </div>

                <div>
                    <span>PAID</span>
                    <strong>{totalPaid.toFixed(2)} JOD</strong>
                </div>

                <div>
                    <span>PENDING</span>
                    <strong>{totalPending.toFixed(2)} JOD</strong>
                </div>
            </section>

            {loading && (
                <div className="parent-payments-state">
                    <div className="parent-payments-spinner"></div>

                    <h2>Loading payments...</h2>

                    <p>
                        Please wait while we load your payment history.
                    </p>
                </div>
            )}

            {!loading && error && (
                <div className="parent-payments-state">
                    <div className="parent-payments-state-icon">!</div>

                    <h2>Unable to load payments</h2>

                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && payments.length === 0 && (
                <div className="parent-payments-state">
                    <div className="parent-payments-state-icon">$</div>

                    <h2>No payments yet</h2>

                    <p>
                        There are currently no payments associated with your
                        academy account.
                    </p>
                </div>
            )}

            {!loading && !error && payments.length > 0 && (
                <section className="parent-payments-list">
                    {payments.map((payment) => (
                        <article
                            className="parent-payments-card"
                            key={payment.id}
                        >
                            <div className="parent-payments-card-main">
                                <div className="parent-payments-icon">
                                    $
                                </div>

                                <div className="parent-payments-details">
                                    <div className="parent-payments-heading">
                                        <div>
                                            <span>PAYMENT</span>

                                            <h2>
                                                {payment.player?.first_name}{' '}
                                                {payment.player?.last_name}
                                            </h2>
                                        </div>

                                        <span
                                            className={`parent-payments-status ${payment.status}`}
                                        >
                                            {formatStatus(payment.status)}
                                        </span>
                                    </div>

                                    <div className="parent-payments-info">
                                        <div>
                                            <span>AMOUNT</span>

                                            <strong>
                                                {formatAmount(
                                                    payment.amount,
                                                    payment.currency
                                                )}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>PAYMENT METHOD</span>

                                            <strong>
                                                {payment.payment_method ||
                                                    'Not specified'}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>DUE DATE</span>

                                            <strong>
                                                {formatDate(payment.due_date)}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>REFERENCE</span>

                                            <strong>
                                                {payment.reference ||
                                                    'Not available'}
                                            </strong>
                                        </div>
                                    </div>

                                    {payment.notes && (
                                        <div className="parent-payments-notes">
                                            <span>NOTES</span>

                                            <p>{payment.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </div>
    );
}