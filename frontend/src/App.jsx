import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ParentDashboard from './pages/parent/ParentDashboard';
import ParentPlayers from './pages/parent/ParentPlayers';
import ParentTraining from './pages/parent/ParentTraining';
import ParentPayments from './pages/parent/ParentPayments';
import ParentNotifications from './pages/parent/ParentNotifications';
import ParentOffers from './pages/parent/ParentOffers';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminPlayers from './pages/admin/AdminPlayers';
import AdminParents from './pages/admin/AdminParents';
import AdminCoaches from './pages/admin/AdminCoaches';
import AdminAgeGroups from './pages/admin/AdminAgeGroups';
import AdminTraining from './pages/admin/AdminTraining';
import AdminPayments from './pages/admin/AdminPayments';
import AdminOffers from './pages/admin/AdminOffers';
import DashboardLayout from './layouts/DashboardLayout';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children, roles }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to={`/${user.role}/dashboard`} replace />;
    }

    return children;
}

function DashboardHome() {
    const { user } = useAuth();

    return (
        <div>
            <h1>Welcome, {user?.name}</h1>
            <p>Your {user?.role} dashboard is ready.</p>
        </div>
    );
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
                element={
                    <ProtectedRoute roles={['admin']}>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route
                    path="/admin/dashboard"
                    element={<AdminDashboard />}
                />
                <Route path="/admin/players" element={<AdminPlayers />} />
                <Route path="/admin/parents" element={<AdminParents />} />
                <Route path="/admin/coaches" element={<AdminCoaches />} />
                <Route
                    path="/admin/age-groups"
                    element={<AdminAgeGroups />}
                />
                <Route
                    path="/admin/training"
                    element={<AdminTraining />}
                />
                <Route
                    path="/admin/payments"
                    element={<AdminPayments />}
                />
                <Route
                    path="/admin/offers"
                    element={<AdminOffers />}
                />
                <Route
                    path="/admin/notifications"
                    element={<AdminNotifications />}
                />
            </Route>

            <Route
                element={
                    <ProtectedRoute roles={['parent']}>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/parent/dashboard" element={<ParentDashboard />} />
                <Route path="/parent/players" element={<ParentPlayers />} />
                <Route path="/parent/training" element={<ParentTraining />} />
                <Route path="/parent/payments" element={<ParentPayments />} />
                <Route
                    path="/parent/notifications"
                    element={<ParentNotifications />}
                />
                <Route
                    path="/parent/offers"
                    element={<ParentOffers />}
                />
            </Route>

            <Route
                element={
                    <ProtectedRoute roles={['coach']}>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/coach/dashboard" element={<DashboardHome />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}