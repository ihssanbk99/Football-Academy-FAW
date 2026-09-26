import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await login(email, password);

            if (data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (data.user.role === 'coach') {
                navigate('/coach/attendance');
            } else {
                navigate('/parent/dashboard');
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to sign in. Please check your email and password.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-background-shape auth-shape-one"></div>
            <div className="auth-background-shape auth-shape-two"></div>

            <div className="auth-container">
                <div className="auth-visual">
                    <div className="auth-visual-overlay"></div>

                    <div className="auth-visual-content">
                        <div className="academy-mark">
                            <span>⚽</span>
                        </div>

                        <span className="auth-eyebrow">
                            FOOTBALL ACADEMY
                        </span>

                        <h1>
                            Develop Talent.
                            <br />
                            Build Champions.
                        </h1>

                        <p>
                            A smarter way to manage players, training,
                            coaches and academy development.
                        </p>

                        <div className="auth-features">
                            <div>
                                <strong>01</strong>
                                <span>Player Development</span>
                            </div>

                            <div>
                                <strong>02</strong>
                                <span>Training Management</span>
                            </div>

                            <div>
                                <strong>03</strong>
                                <span>Academy Performance</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-form-section">
                    <div className="auth-form-wrapper">
                        <div className="auth-mobile-logo">
                            <div className="academy-mark">
                                <span>⚽</span>
                            </div>
                            <span>FAW</span>
                        </div>

                        <div className="auth-heading">
                            <span>WELCOME BACK</span>
                            <h2>Sign in to your account</h2>
                            <p>
                                Access your academy portal and continue managing
                                your football journey.
                            </p>
                        </div>

                        {error && (
                            <div className="auth-error">
                                <span>!</span>
                                <p>{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="auth-field">
                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon">
                                        ✉
                                    </span>

                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon">
                                        ●
                                    </span>

                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="auth-submit"
                                disabled={loading}
                            >
                                <span>
                                    {loading
                                        ? 'Signing in...'
                                        : 'Sign In'}
                                </span>

                                {!loading && (
                                    <span className="auth-arrow">→</span>
                                )}
                            </button>
                        </form>

                        <div className="auth-divider">
                            <span></span>
                            <p>NEW TO FAW?</p>
                            <span></span>
                        </div>

                        <Link
                            to="/register"
                            className="auth-register"
                        >
                            Create a Parent Account
                            <span>→</span>
                        </Link>

                        <p className="auth-footer">
                            FAW Football Academy Management System
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}