import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import RegisterPlayer from './pages/RegisterPlayer';

import DashboardLayout from './layouts/DashboardLayout';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPlayers from './pages/admin/AdminPlayers';
import AdminParents from './pages/admin/AdminParents';
import AdminCoaches from './pages/admin/AdminCoaches';
import AdminAgeGroups from './pages/admin/AdminAgeGroups';
import AdminTraining from './pages/admin/AdminTraining';
import AdminTrialBookings from './pages/admin/AdminTrialBookings';
import AdminUniforms from './pages/admin/AdminUniforms';
import AdminTransportation from './pages/admin/AdminTransportation';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminTracking from './pages/admin/AdminTracking';
import AdminPayments from './pages/admin/AdminPayments';
import AdminOffers from './pages/admin/AdminOffers';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminAssessments from './pages/admin/AdminAssessments';

import ParentDashboard from './pages/parent/ParentDashboard';
import ParentPlayers from './pages/parent/ParentPlayers';
import ParentTraining from './pages/parent/ParentTraining';
import ParentTrialBooking from './pages/parent/ParentTrialBooking';
import ParentTracking from './pages/parent/ParentTracking';
import ParentPayments from './pages/parent/ParentPayments';
import ParentOffers from './pages/parent/ParentOffers';
import ParentNotifications from './pages/parent/ParentNotifications';
import ParentAssessments from './pages/parent/ParentAssessments';

import CoachAttendance from './pages/coach/CoachAttendance';
import CoachAssessments from './pages/coach/CoachAssessments';

function ProtectedRoute({ children, roles }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
                path="/admin"
                element={
                    <ProtectedRoute roles={['admin']}>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="players" element={<AdminPlayers />} />
                <Route path="parents" element={<AdminParents />} />
                <Route path="coaches" element={<AdminCoaches />} />
                <Route path="age-groups" element={<AdminAgeGroups />} />
                <Route path="training" element={<AdminTraining />} />
                <Route
                    path="trial-bookings"
                    element={<AdminTrialBookings />}
                />
                <Route path="uniforms" element={<AdminUniforms />} />
                <Route
                    path="transportation"
                    element={<AdminTransportation />}
                />
                <Route
                    path="attendance"
                    element={<AdminAttendance />}
                />
                <Route path="tracking" element={<AdminTracking />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="offers" element={<AdminOffers />} />
                <Route
                    path="assessments"
                    element={<AdminAssessments />}
                />
                <Route
                    path="notifications"
                    element={<AdminNotifications />}
                />
            </Route>

            <Route
                path="/parent"
                element={
                    <ProtectedRoute roles={['parent']}>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<ParentDashboard />} />
                <Route
                    path="register-player"
                    element={<RegisterPlayer />}
                />
                <Route path="players" element={<ParentPlayers />} />
                <Route
                    path="training"
                    element={<ParentTraining />}
                />
                <Route
                    path="trial-booking"
                    element={<ParentTrialBooking />}
                />
                <Route path="tracking" element={<ParentTracking />} />
                <Route path="payments" element={<ParentPayments />} />
                <Route path="offers" element={<ParentOffers />} />
                <Route
                    path="assessments"
                    element={<ParentAssessments />}
                />
                <Route
                    path="notifications"
                    element={<ParentNotifications />}
                />
            </Route>

            <Route
                path="/coach"
                element={
                    <ProtectedRoute roles={['coach']}>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route
                    path="attendance"
                    element={<CoachAttendance />}
                />
                <Route
                    path="assessments"
                    element={<CoachAssessments />}
                />
            </Route>

            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />
        </Routes>
    );
}

export default App;