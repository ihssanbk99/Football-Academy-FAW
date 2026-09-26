import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

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
        <div className="login-page">
            <div className="login-background-shape login-shape-one"></div>
            <div className="login-background-shape login-shape-two"></div>

            <div className="login-container">
                <div className="login-visual">
                    <div className="login-visual-overlay"></div>

                    <div className="login-visual-content">
                        <div className="login-academy-mark">
                            <span>⚽</span>
                        </div>

                        <span className="login-eyebrow">
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

                        <div className="login-features">
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

                <div className="login-form-section">
                    <div className="login-form-wrapper">
                        <div className="login-mobile-logo">
                            <div className="login-academy-mark">
                                <span>⚽</span>
                            </div>
                            <span>FAW</span>
                        </div>

                        <div className="login-heading">
                            <span>WELCOME BACK</span>
                            <h2>Sign in to your account</h2>
                            <p>
                                Access your academy portal and continue managing
                                your football journey.
                            </p>
                        </div>

                        {error && (
                            <div className="login-error">
                                <span>!</span>
                                <p>{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="login-field">
                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <div className="login-input-wrapper">
                                    <span className="login-input-icon">
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

                            <div className="login-field">
                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="login-input-wrapper">
                                    <span className="login-input-icon">
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
                                className="login-submit"
                                disabled={loading}
                            >
                                <span>
                                    {loading
                                        ? 'Signing in...'
                                        : 'Sign In'}
                                </span>

                                {!loading && (
                                    <span className="login-arrow">→</span>
                                )}
                            </button>
                        </form>

                        <div className="login-divider">
                            <span></span>
                            <p>NEW TO FAW?</p>
                            <span></span>
                        </div>

                        <Link
                            to="/register"
                            className="login-register"
                        >
                            Create a Parent Account
                            <span>→</span>
                        </Link>

                        <p className="login-footer">
                            FAW Football Academy Management System
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}