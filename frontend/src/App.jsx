import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

// Dashboards
import AdminDashboard from './pages/dashboards/AdminDashboard';
import ParentDashboard from './pages/dashboards/ParentDashboard';
import CoachDashboard from './pages/dashboards/CoachDashboard';
import DriverDashboard from './pages/dashboards/DriverDashboard';

// Parent Pages
import RegisterPlayer from './pages/parent/RegisterPlayer';

// Coach Pages
import Attendance from './pages/coach/Attendance';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Admin Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Route>

                {/* Parent Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
                    <Route path="/parent/dashboard" element={<ParentDashboard />} />
                    <Route path="/parent/register-player" element={<RegisterPlayer />} />
                </Route>

                {/* Coach Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['coach']} />}>
                    <Route path="/coach/dashboard" element={<CoachDashboard />} />
                    <Route path="/coach/attendance" element={<Attendance />} />
                </Route>

                {/* Driver Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['driver']} />}>
                    <Route path="/driver/dashboard" element={<DriverDashboard />} />
                </Route>

                {/* Unauthorized Access Route */}
                <Route
                    path="/unauthorized"
                    element={
                        <div className="min-h-screen flex items-center justify-center bg-gray-100">
                            <h1 className="text-xl font-bold text-red-600">
                                403 - Unauthorized Access
                            </h1>
                        </div>
                    }
                />

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}