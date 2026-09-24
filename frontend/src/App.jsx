import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
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
                <Route path="/admin/dashboard" element={<DashboardHome />} />
            </Route>

            <Route
                element={
                    <ProtectedRoute roles={['parent']}>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/parent/dashboard" element={<DashboardHome />} />
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