import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const role = user?.role;

    const menus = {
        admin: [
            { label: 'Dashboard', path: '/admin/dashboard', icon: '⌂' },
            { label: 'Players', path: '/admin/players', icon: '⚽' },
            { label: 'Parents', path: '/admin/parents', icon: '◉' },
            { label: 'Coaches', path: '/admin/coaches', icon: '★' },
            { label: 'Age Groups', path: '/admin/age-groups', icon: '◫' },
            { label: 'Training', path: '/admin/training', icon: '▣' },
            {
                label: 'Trial Bookings',
                path: '/admin/trial-bookings',
                icon: '⚽',
            },
            { label: 'Uniforms', path: '/admin/uniforms', icon: '👕' },
            {
                label: 'Transportation',
                path: '/admin/transportation',
                icon: '🚌',
            },
            { label: 'Payments', path: '/admin/payments', icon: '$' },
            { label: 'Offers', path: '/admin/offers', icon: '%' },
            {
                label: 'Notifications',
                path: '/admin/notifications',
                icon: '◌',
            },
        ],
        parent: [
            { label: 'Dashboard', path: '/parent/dashboard', icon: '⌂' },
            { label: 'My Players', path: '/parent/players', icon: '⚽' },
            {
                label: 'Trial Booking',
                path: '/parent/trial-booking',
                icon: '⚽',
            },
            { label: 'Training', path: '/parent/training', icon: '▣' },
            { label: 'Payments', path: '/parent/payments', icon: '$' },
            { label: 'Offers', path: '/parent/offers', icon: '%' },
            {
                label: 'Notifications',
                path: '/parent/notifications',
                icon: '◌',
            },
        ],
        coach: [
            { label: 'Dashboard', path: '/coach/dashboard', icon: '⌂' },
            { label: 'My Players', path: '/coach/players', icon: '⚽' },
            { label: 'Training', path: '/coach/training', icon: '▣' },
            { label: 'Attendance', path: '/coach/attendance', icon: '✓' },
            { label: 'Assessments', path: '/coach/assessments', icon: '★' },
        ],
    };

    const currentMenu = menus[role] || [];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-layout">
            <aside
                className={`dashboard-sidebar ${
                    sidebarOpen ? 'open' : ''
                }`}
            >
                <div className="dashboard-brand">
                    <div className="dashboard-brand-mark">⚽</div>

                    <div>
                        <strong>FAW</strong>
                        <span>Football Academy</span>
                    </div>
                </div>

                <div className="dashboard-role">
                    <span>PORTAL</span>
                    <strong>{role}</strong>
                </div>

                <nav className="dashboard-nav">
                    {currentMenu.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `dashboard-nav-item ${
                                    isActive ? 'active' : ''
                                }`
                            }
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="dashboard-nav-icon">
                                {item.icon}
                            </span>

                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="dashboard-sidebar-bottom">
                    <button
                        type="button"
                        className="dashboard-logout"
                        onClick={handleLogout}
                    >
                        <span>↪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {sidebarOpen && (
                <div
                    className="dashboard-overlay"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <div className="dashboard-main">
                <header className="dashboard-header">
                    <button
                        type="button"
                        className="dashboard-menu-button"
                        onClick={() => setSidebarOpen(true)}
                    >
                        ☰
                    </button>

                    <div className="dashboard-header-title">
                        <span>FAW ACADEMY</span>
                        <strong>{role} portal</strong>
                    </div>

                    <div className="dashboard-user">
                        <div className="dashboard-user-avatar">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>

                        <div className="dashboard-user-info">
                            <strong>{user?.name}</strong>
                            <span>{user?.email}</span>
                        </div>
                    </div>
                </header>

                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}