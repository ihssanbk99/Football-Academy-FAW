import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== passwordConfirmation) {
            setError('Passwords do not match.');
            return;
        }

        setSubmitting(true);

        try {
            const data = await register(
                name,
                email,
                password,
                passwordConfirmation
            );

            if (data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (data.user.role === 'coach') {
                navigate('/coach/dashboard');
            } else {
                navigate('/parent/dashboard');
            }
        } catch (err) {
            const validationErrors = err.response?.data?.errors;

            if (validationErrors) {
                const firstError = Object.values(validationErrors)[0];
                setError(Array.isArray(firstError) ? firstError[0] : firstError);
            } else {
                setError(
                    err.response?.data?.message ||
                    'An error occurred during registration.'
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-background-shape auth-shape-one"></div>
            <div className="auth-background-shape auth-shape-two"></div>

            <div className="auth-container register-container">
                <div className="auth-visual">
                    <div className="auth-visual-overlay"></div>

                    <div className="auth-visual-content">
                        <div className="academy-mark">
                            <span>⚽</span>
                        </div>

                        <span className="auth-eyebrow">FAW FOOTBALL ACADEMY</span>

                        <h1>
                            Start Your
                            <br />
                            Football Journey.
                        </h1>

                        <p>
                            Join the academy community and keep everything
                            about your player's football journey in one place.
                        </p>

                        <div className="auth-features">
                            <div>
                                <strong>01</strong>
                                <span>Manage Your Players</span>
                            </div>

                            <div>
                                <strong>02</strong>
                                <span>Follow Training</span>
                            </div>

                            <div>
                                <strong>03</strong>
                                <span>Track Development</span>
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
                            <span>GET STARTED</span>
                            <h2>Create your account</h2>
                            <p>
                                Create your parent account and start managing
                                your player's academy journey.
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
                                <label htmlFor="name">Full Name</label>

                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon">◉</span>

                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="register-email">
                                    Email Address
                                </label>

                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon">✉</span>

                                    <input
                                        id="register-email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="register-password">
                                    Password
                                </label>

                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon">●</span>

                                    <input
                                        id="register-password"
                                        type="password"
                                        required
                                        minLength={8}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Minimum 8 characters"
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="password-confirmation">
                                    Confirm Password
                                </label>

                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon">●</span>

                                    <input
                                        id="password-confirmation"
                                        type="password"
                                        required
                                        minLength={8}
                                        value={passwordConfirmation}
                                        onChange={(e) =>
                                            setPasswordConfirmation(e.target.value)
                                        }
                                        placeholder="Repeat your password"
                                    />
                                </div>
                            </div>

                            <div className="auth-account-info">
                                <div className="auth-account-icon">✓</div>

                                <div>
                                    <strong>Parent Account</strong>
                                    <span>
                                        You can manage your players, training,
                                        payments and academy activities.
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="auth-submit"
                                disabled={submitting}
                            >
                                <span>
                                    {submitting
                                        ? 'Creating account...'
                                        : 'Create Account'}
                                </span>

                                {!submitting && (
                                    <span className="auth-arrow">→</span>
                                )}
                            </button>
                        </form>

                        <div className="auth-divider">
                            <span></span>
                            <p>ALREADY A MEMBER?</p>
                            <span></span>
                        </div>

                        <Link to="/login" className="auth-register">
                            Sign In to Your Account
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