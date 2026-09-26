import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './CoachDashboard.css';

export default function CoachDashboard() {
    const { user } = useAuth();

    return (
        <div className="coach-dashboard-page">
            <div className="coach-dashboard-header">
                <div>
                    <span className="coach-dashboard-eyebrow">
                        COACH PORTAL
                    </span>

                    <h1>Welcome, {user?.name}</h1>

                    <p>
                        Manage player attendance and development
                        assessments from your coach portal.
                    </p>
                </div>

                <div className="coach-dashboard-mark">
                    ⚽
                </div>
            </div>

            <div className="coach-dashboard-grid">
                <Link
                    to="/coach/attendance"
                    className="coach-dashboard-card"
                >
                    <div className="coach-dashboard-card-icon">
                        ✓
                    </div>

                    <div>
                        <h2>Attendance</h2>

                        <p>
                            Record and update player attendance for
                            your training sessions.
                        </p>
                    </div>

                    <span className="coach-dashboard-card-arrow">
                        →
                    </span>
                </Link>

                <Link
                    to="/coach/assessments"
                    className="coach-dashboard-card"
                >
                    <div className="coach-dashboard-card-icon">
                        ★
                    </div>

                    <div>
                        <h2>Assessments</h2>

                        <p>
                            Evaluate the development and performance
                            of your assigned players.
                        </p>
                    </div>

                    <span className="coach-dashboard-card-arrow">
                        →
                    </span>
                </Link>
            </div>

            <div className="coach-dashboard-info">
                <div>
                    <strong>Coach Access</strong>
                    <p>
                        Your account is limited to attendance and
                        player assessments.
                    </p>
                </div>

                <span>FAW</span>
            </div>
        </div>
    );
}