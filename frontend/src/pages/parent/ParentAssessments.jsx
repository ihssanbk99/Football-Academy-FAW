import { useEffect, useState } from 'react';
import api from '../../services/api';
import './ParentAssessments.css';

function ParentAssessments() {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAssessments = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await api.get('/parent/assessments');

            setAssessments(response.data.assessments || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Unable to load assessments.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssessments();
    }, []);

    if (loading) {
        return (
            <div className="parent-assessments-page">
                <div className="parent-assessments-loading">
                    Loading assessments...
                </div>
            </div>
        );
    }

    return (
        <div className="parent-assessments-page">
            <div className="parent-assessments-header">
                <div>
                    <h1>Player Assessments</h1>
                    <p>
                        View your children&apos;s football development
                        assessments.
                    </p>
                </div>

                <div className="parent-assessments-count">
                    {assessments.length}
                </div>
            </div>

            {error && (
                <div className="parent-assessments-error">
                    {error}
                </div>
            )}

            {assessments.length === 0 ? (
                <div className="parent-assessments-empty">
                    <h2>No assessments yet</h2>
                    <p>
                        Your children&apos;s assessments will appear here
                        once they are added by their coach.
                    </p>
                </div>
            ) : (
                <div className="parent-assessments-list">
                    {assessments.map((assessment) => (
                        <div
                            className="parent-assessment-card"
                            key={assessment.id}
                        >
                            <div className="parent-assessment-card-header">
                                <div>
                                    <h2>
                                        {assessment.player?.first_name}{' '}
                                        {assessment.player?.last_name}
                                    </h2>

                                    <p>
                                        {assessment.assessment_date
                                            ? new Date(
                                                  assessment.assessment_date
                                              ).toLocaleDateString()
                                            : '-'}
                                    </p>
                                </div>

                                <div className="parent-assessment-overall">
                                    <span>Overall</span>
                                    <strong>
                                        {assessment.overall_score ?? '-'}
                                        {assessment.overall_score
                                            ? '/10'
                                            : ''}
                                    </strong>
                                </div>
                            </div>

                            <div className="parent-assessment-scores">
                                <div>
                                    <span>Technical</span>
                                    <strong>
                                        {assessment.technical_score ?? '-'}
                                    </strong>
                                </div>

                                <div>
                                    <span>Tactical</span>
                                    <strong>
                                        {assessment.tactical_score ?? '-'}
                                    </strong>
                                </div>

                                <div>
                                    <span>Physical</span>
                                    <strong>
                                        {assessment.physical_score ?? '-'}
                                    </strong>
                                </div>

                                <div>
                                    <span>Discipline</span>
                                    <strong>
                                        {assessment.discipline_score ?? '-'}
                                    </strong>
                                </div>
                            </div>

                            <div className="parent-assessment-details">
                                <div>
                                    <span>Coach</span>
                                    <strong>
                                        {assessment.coach?.full_name || '-'}
                                    </strong>
                                </div>

                                <div>
                                    <span>Training Session</span>
                                    <strong>
                                        {assessment.trainingSession?.title ||
                                            '-'}
                                    </strong>
                                </div>
                            </div>

                            {assessment.strengths && (
                                <div className="parent-assessment-section">
                                    <h3>Strengths</h3>
                                    <p>{assessment.strengths}</p>
                                </div>
                            )}

                            {assessment.areas_to_improve && (
                                <div className="parent-assessment-section">
                                    <h3>Areas to Improve</h3>
                                    <p>{assessment.areas_to_improve}</p>
                                </div>
                            )}

                            {assessment.notes && (
                                <div className="parent-assessment-section">
                                    <h3>Coach Notes</h3>
                                    <p>{assessment.notes}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ParentAssessments;