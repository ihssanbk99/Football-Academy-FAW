import { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminPayments.css';

export default function AdminPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPayments = async () => {
        try {
            const response = await api.get('/admin/payments');
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

    useEffect(() => {
        fetchPayments();
    }, []);

    const paidPayments = payments.filter(
        (payment) => payment.status === 'paid'
    );

    const pendingPayments = payments.filter(
        (payment) => payment.status === 'pending'
    );

    const totalPaid = paidPayments.reduce(
        (total, payment) => total + Number(payment.amount || 0),
        0
    );

    const formatDate = (date) => {
        if (!date) {
            return 'Not available';
        }

        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatAmount = (amount, currency = 'JOD') => {
        return `${Number(amount || 0).toFixed(2)} ${currency}`;
    };

    return (
        <div className="admin-payments-page">
            <section className="admin-payments-hero">
                <div>
                    <span>ACADEMY FINANCE</span>
                    <h1>Payments</h1>
                    <p>
                        Monitor parent payments, payment status, and academy
                        revenue.
                    </p>
                </div>

                <div className="admin-payments-hero-icon">$</div>
            </section>

            <section className="admin-payments-summary">
                <div className="admin-payments-summary-card">
                    <span>TOTAL PAYMENTS</span>
                    <strong>{payments.length}</strong>
                </div>

                <div className="admin-payments-summary-card">
                    <span>PAID PAYMENTS</span>
                    <strong>{paidPayments.length}</strong>
                </div>

                <div className="admin-payments-summary-card">
                    <span>PENDING</span>
                    <strong>{pendingPayments.length}</strong>
                </div>

                <div className="admin-payments-summary-card">
                    <span>TOTAL PAID</span>
                    <strong>{totalPaid.toFixed(2)} JOD</strong>
                </div>
            </section>

            {loading && (
                <div className="admin-payments-state">
                    <div className="admin-payments-spinner"></div>
                    <h2>Loading payments...</h2>
                    <p>Please wait while we load academy payments.</p>
                </div>
            )}

            {!loading && error && (
                <div className="admin-payments-state">
                    <div className="admin-payments-state-icon">!</div>
                    <h2>Unable to load payments</h2>
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && payments.length === 0 && (
                <div className="admin-payments-state">
                    <div className="admin-payments-state-icon">$</div>
                    <h2>No payments yet</h2>
                    <p>Parent payment records will appear here.</p>
                </div>
            )}

            {!loading && !error && payments.length > 0 && (
                <section className="admin-payments-table-section">
                    <div className="admin-payments-table-header">
                        <div>
                            <span>PAYMENT DIRECTORY</span>
                            <h2>All Payments</h2>
                        </div>

                        <span className="admin-payments-count">
                            {payments.length} Payments
                        </span>
                    </div>

                    <div className="admin-payments-table-wrapper">
                        <table className="admin-payments-table">
                            <thead>
                                <tr>
                                    <th>Reference</th>
                                    <th>Parent</th>
                                    <th>Player</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {payments.map((payment) => (
                                    <tr key={payment.id}>
                                        <td>
                                            <div className="admin-payment-reference">
                                                <strong>
                                                    {payment.reference ||
                                                        `Payment #${payment.id}`}
                                                </strong>
                                                <span>
                                                    #{payment.id}
                                                </span>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="admin-payment-person">
                                                <strong>
                                                    {payment.parent?.name ||
                                                        'Unknown'}
                                                </strong>
                                                <span>
                                                    {payment.parent?.email ||
                                                        'No email'}
                                                </span>
                                            </div>
                                        </td>

                                        <td>
                                            <span className="admin-payment-player">
                                                {payment.player
                                                    ? `${payment.player.first_name} ${payment.player.last_name}`
                                                    : 'Unknown'}
                                            </span>
                                        </td>

                                        <td>
                                            <strong className="admin-payment-amount">
                                                {formatAmount(
                                                    payment.amount,
                                                    payment.currency
                                                )}
                                            </strong>
                                        </td>

                                        <td>
                                            <span className="admin-payment-method">
                                                {payment.payment_method ||
                                                    'Not specified'}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="admin-payment-date">
                                                {formatDate(
                                                    payment.due_date
                                                )}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={`admin-payment-status ${
                                                    payment.status ||
                                                    'pending'
                                                }`}
                                            >
                                                {payment.status || 'pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </div>
    );
}