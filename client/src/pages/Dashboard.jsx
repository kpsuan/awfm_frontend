import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import Button from '../components/common/Button/Button';
import { ContentHeader } from '../components/common/Navigation';
import { questionsService, responsesService } from '../services/questionnaire';
import { teamsService } from '../services/teams';
import './Dashboard.css';

// Mock recordings - would come from API
const RECORDINGS = [
  {
    id: 1,
    questionId: 'Q10A',
    questionTitle: 'Physical Limitations',
    duration: '2:34',
    createdAt: 'Dec 28, 2024',
  },
  {
    id: 2,
    questionId: 'Q11',
    questionTitle: 'Pain Management',
    duration: '1:45',
    createdAt: 'Dec 25, 2024',
  },
  {
    id: 3,
    questionId: 'Q10B',
    questionTitle: 'Cognitive Limitations',
    duration: '3:12',
    createdAt: 'Dec 20, 2024',
  },
];

// Helper to get initials from name
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Generate a consistent color from a string
const getColorFromString = (str) => {
  const colors = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#06b6d4', '#10b981', '#ef4444'];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Format date for recent sessions
const formatRelativeDate = (dateStr) => {
  if (!dateStr) return 'Recently';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

function Dashboard() {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth();

  // State for data
  const [questions, setQuestions] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [careTeams, setCareTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !authUser) {
      navigate('/login');
    }
  }, [authUser, authLoading, navigate]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch questions from content API
        const questionsResponse = await questionsService.getAll();
        // Handle both paginated (results array) and non-paginated (direct array) responses
        let questionsData = questionsResponse.data || [];
        if (questionsData.results) {
          questionsData = questionsData.results;
        }
        if (!Array.isArray(questionsData)) {
          console.warn('Questions data is not an array:', questionsData);
          questionsData = [];
        }

        // Fetch user progress (requires auth)
        let progressResponse = { data: [] };
        try {
          progressResponse = await responsesService.getSummary();
        } catch (err) {
          // User might not be logged in, use empty progress
          console.log('Could not fetch progress (user may not be logged in):', err.message);
        }

        // Fetch care teams (requires auth)
        let teamsData = [];
        try {
          teamsData = await teamsService.getTeams();
        } catch (err) {
          // User might not be logged in
          console.log('Could not fetch teams (user may not be logged in):', err.message);
        }

        setQuestions(questionsData);
        setProgressData(progressResponse.data || []);
        setCareTeams(Array.isArray(teamsData) ? teamsData : []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform questions for display with progress
  const getQuestionsWithProgress = () => {
    if (!Array.isArray(questions)) return [];
    return questions.map(question => {
      // Find progress for this question
      const progress = progressData.find(p => p.question_id === question.id);
      const totalLayers = 3; // Default to 3 layers
      const completedLayers = progress?.completed_layers || 0;
      const progressPercent = Math.round((completedLayers / totalLayers) * 100);

      return {
        id: question.id,
        title: question.title || question.id,
        description: question.question_text || 'Explore your values and preferences for this topic.',
        progress: progressPercent,
        layersCompleted: completedLayers,
        totalLayers: totalLayers,
        lastUpdated: progress?.last_updated,
        imageUrl: question.image_url || question.thumbnail_url || null,
        thumbnailUrl: question.thumbnail_url || question.image_url || null,
      };
    });
  };

  // Get recent sessions from progress data
  const getRecentSessions = () => {
    if (!Array.isArray(progressData)) return [];
    return progressData
      .filter(p => p.completed_layers > 0)
      .sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated))
      .slice(0, 2)
      .map(p => ({
        questionId: p.question_id,
        questionTitle: p.question_title || p.question_id,
        date: formatRelativeDate(p.last_updated),
        layer: p.completed_layers,
      }));
  };

  // Transform care teams for display
  const getTransformedTeams = () => {
    if (!Array.isArray(careTeams)) return [];
    return careTeams.map(team => ({
      id: team.id,
      name: team.name,
      level: team.team_level || 1,
      members: (team.members || [])
        .filter(m => m.status === 'active')
        .map(member => ({
          id: member.user_id,
          name: member.display_name,
          initials: getInitials(member.display_name),
          color: getColorFromString(member.display_name || member.email),
        })),
      questionsAnswered: 0, // TODO: Calculate from team responses
      totalQuestions: questions.length || 4,
    }));
  };

  // Calculate overall progress
  const getOverallProgress = () => {
    const questionsWithProgress = getQuestionsWithProgress();
    if (questionsWithProgress.length === 0) return { progress: 0, completed: 0, total: 0 };

    const completed = questionsWithProgress.filter(q => q.progress === 100).length;
    const progress = Math.round(
      questionsWithProgress.reduce((sum, q) => sum + q.progress, 0) / questionsWithProgress.length
    );

    return {
      progress,
      completed,
      total: questionsWithProgress.length,
    };
  };

  // User data from auth context
  const overallStats = getOverallProgress();
  const userName = authUser?.display_name || authUser?.email?.split('@')[0] || 'User';
  const user = {
    name: userName,
    overallProgress: overallStats.progress,
    questionsCompleted: overallStats.completed,
    totalQuestions: overallStats.total || 4,
  };

  const handleQuestionClick = (questionId) => {
    navigate(`/questionnaire/${questionId}`);
  };

  const getButtonText = (question) => {
    if (question.progress === 0) return 'Start';
    if (question.progress === 100) return 'Review';
    return 'Continue';
  };

  // Get transformed data
  const displayQuestions = getQuestionsWithProgress();
  const recentSessions = getRecentSessions();
  const displayTeams = getTransformedTeams();

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-error">
          <p>Unable to load dashboard: {error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <ContentHeader />
      <div className="dashboard-layout">
        {/* ==================== */}
        {/* LEFT COLUMN - Main Content */}
        {/* ==================== */}
        <div className="dashboard-main">
          {/* Welcome Header */}
          <div className="welcome-header">
            <div className="welcome-content">
              <h1 className="welcome-title">Welcome back, {user.name}</h1>
              <p className="welcome-subtitle">Continue planning your advance care directives</p>
            </div>
            <div className="welcome-progress">
              <div className="progress-circle">
                <svg viewBox="0 0 36 36" className="progress-ring">
                  <path
                    className="progress-ring-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="progress-ring-fill"
                    strokeDasharray={`${user.overallProgress}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="progress-circle-text">{user.overallProgress}%</span>
              </div>
              <div className="progress-details">
                <span className="progress-label">Overall Progress</span>
                <span className="progress-count">{user.questionsCompleted}/{user.totalQuestions} questions</span>
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          {recentSessions.length > 0 && (
            <section className="dashboard-section recent-sessions">
              <div className="section-header">
                <h2 className="section-title">Recent Sessions</h2>
                <Button variant="ghost" size="sm">View History</Button>
              </div>
              <div className="recent-sessions-grid">
                {recentSessions.map((session, index) => (
                  <div
                    key={index}
                    className="session-card"
                    onClick={() => handleQuestionClick(session.questionId)}
                  >
                    <div className="session-card-image">
                      <span className="session-image-label">{session.questionId}</span>
                      <div className="session-layer-badge">Layer {session.layer}/3</div>
                    </div>
                    <div className="session-card-content">
                      <h3 className="session-card-title">{session.questionTitle}</h3>
                      <div className="session-card-footer">
                        <span className="session-card-date">{session.date}</span>
                        <Button variant="primary" size="sm">Continue</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 5: Advance Care Planning */}
          <section className="dashboard-section questions-section">
            <div className="section-header">
              <h2 className="section-title">Section 5. Advance Care Planning</h2>
            </div>
            <p className="section-description">
              These questions help you explore your values and preferences for medical care decisions.
            </p>

            {displayQuestions.length === 0 ? (
              <div className="questions-empty">
                <p>No questions available. Please check back later.</p>
              </div>
            ) : (
            <div className="questions-grid">
              {displayQuestions.map((question) => (
                <div key={question.id} className="question-card" onClick={() => handleQuestionClick(question.id)}>
                  <div className="question-card-image">
                    {question.thumbnailUrl || question.imageUrl ? (
                      <img
                        src={question.thumbnailUrl || question.imageUrl}
                        alt={question.title}
                        className="question-image"
                      />
                    ) : (
                      <div className="image-placeholder">
                        <span className="placeholder-label">{question.id}</span>
                      </div>
                    )}
                  </div>
                  <div className="question-card-content">
                    <div className="question-card-header">
                      <span className="question-id">{question.id}</span>
                      <h3 className="question-title">{question.title}</h3>
                    </div>
                    <p className="question-description">{question.description}</p>
                    <div className="question-progress">
                      <div className="progress-bar-small">
                        <div
                          className="progress-bar-fill-small"
                          style={{ width: `${question.progress}%` }}
                        />
                      </div>
                      <span className="progress-text">{question.layersCompleted}/{question.totalLayers} layers</span>
                    </div>
                    <Button
                      variant={question.progress > 0 && question.progress < 100 ? 'secondary' : 'primary'}
                      size="sm"
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuestionClick(question.id);
                      }}
                    >
                      {getButtonText(question)}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            )}
          </section>
        </div>

        {/* ==================== */}
        {/* RIGHT COLUMN - Sidebar */}
        {/* ==================== */}
        <div className="dashboard-sidebar">
          {/* Your Care Teams */}
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <h3 className="sidebar-card-title">Your Care Teams</h3>
              <Button variant="ghost" size="sm">Manage</Button>
            </div>
            {displayTeams.length > 0 ? (
              <div className="teams-list">
                {displayTeams.map((team) => (
                  <div key={team.id} className="team-item">
                    <div className="team-avatars">
                      {team.members.slice(0, 3).map((member, idx) => (
                        <div
                          key={member.id}
                          className="team-avatar"
                          style={{
                            backgroundColor: member.color,
                            zIndex: team.members.length - idx,
                          }}
                          title={member.name}
                        >
                          {member.initials}
                        </div>
                      ))}
                      {team.members.length > 3 && (
                        <div className="team-avatar team-avatar-more">
                          +{team.members.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="team-info">
                      <div className="team-name-row">
                        <span className="team-level">L{team.level}</span>
                        <span className="team-name">{team.name}</span>
                      </div>
                      <div className="team-progress-row">
                        <div className="team-progress-bar">
                          <div
                            className="team-progress-fill"
                            style={{ width: `${(team.questionsAnswered / team.totalQuestions) * 100}%` }}
                          />
                        </div>
                        <span className="team-progress-text">{team.questionsAnswered}/{team.totalQuestions}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  leftIcon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  }
                >
                  Add Care Team
                </Button>
              </div>
            ) : (
              <div className="teams-empty">
                <p>No care teams yet</p>
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  leftIcon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  }
                >
                  Create Your First Team
                </Button>
              </div>
            )}
          </div>

          {/* Your Recordings */}
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <h3 className="sidebar-card-title">Your Recordings</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            {RECORDINGS.length > 0 ? (
              <div className="recordings-list">
                {RECORDINGS.map((recording) => (
                  <div key={recording.id} className="recording-item">
                    <div className="recording-thumb">
                      <div className="recording-play">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <span className="recording-duration">{recording.duration}</span>
                    </div>
                    <div className="recording-details">
                      <span className="recording-title">{recording.questionTitle}</span>
                      <span className="recording-meta">{recording.questionId} · {recording.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="recordings-empty-small">
                <p>No recordings yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
