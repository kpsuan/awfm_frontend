import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context';
import Button from '../components/common/Button/Button';
import { ContentHeader } from '../components/common/Navigation';
import { AddMemberModal } from '../components/common/Modal';
import { questionsService, responsesService } from '../services/questionnaire';
import { teamsService } from '../services/teams';
import { getAllProgress } from './QuestionnaireFlow/utils/progressStorage';
import './Dashboard.css';

// Carousel images for welcome header
const CAROUSEL_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1758686254041-88d7b6ecee8f?q=80&w=400&h=300&auto=format&fit=crop',
    alt: 'Healthcare planning',
  },
  {
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400&h=300&auto=format&fit=crop',
    alt: 'Medical consultation',
  },
  {
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&h=300&auto=format&fit=crop',
    alt: 'Family care',
  },
  {
    url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=400&h=300&auto=format&fit=crop',
    alt: 'Healthcare support',
  },
];

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
  const [localProgress, setLocalProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carousel state
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Care Team Modal state
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [createdTeam, setCreatedTeam] = useState(null);

  // Carousel auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Carousel navigation
  const goToSlide = (index) => setCarouselIndex(index);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !authUser) {
      navigate('/login');
    }
  }, [authUser, authLoading, navigate]);

  // Load localStorage progress immediately (sync, before any API calls)
  useEffect(() => {
    setLocalProgress(getAllProgress());
  }, []);

  // Fetch data on mount - parallel API calls for speed
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel for faster loading
        const [questionsResponse, progressResponse, teamsResponse] = await Promise.all([
          questionsService.getAll().catch(err => {
            console.log('Could not fetch questions:', err.message);
            return { data: [] };
          }),
          responsesService.getSummary().catch(err => {
            console.log('Could not fetch progress:', err.message);
            return { data: [] };
          }),
          teamsService.getTeams().catch(err => {
            console.log('Could not fetch teams:', err.message);
            return [];
          })
        ]);

        // Process questions data
        let questionsData = questionsResponse.data || [];
        if (questionsData.results) {
          questionsData = questionsData.results;
        }
        if (!Array.isArray(questionsData)) {
          questionsData = [];
        }

        setQuestions(questionsData);
        setProgressData(progressResponse.data || []);

        // Handle teams response - could be array or {data: []} or {results: []}
        let teamsData = teamsResponse;
        if (teamsResponse?.data) teamsData = teamsResponse.data;
        if (teamsResponse?.results) teamsData = teamsResponse.results;
        setCareTeams(Array.isArray(teamsData) ? teamsData : []);
        console.log('Teams fetched:', teamsData); // Debug log
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
      // Find backend progress for this question
      const backendProgress = progressData.find(p => p.question_id === question.id);

      // Find localStorage progress for this question
      const localQuestionProgress = localProgress[question.id];

      // Calculate completed layers from localStorage (completedCheckpoints)
      let localCompletedLayers = 0;
      if (localQuestionProgress?.completedCheckpoints) {
        const cp = localQuestionProgress.completedCheckpoints;
        if (cp.q1) localCompletedLayers++;
        if (cp.q2) localCompletedLayers++;
        if (cp.q3) localCompletedLayers++;
      }

      // Check if user has started (has any choices selected)
      const hasStartedLocal = localQuestionProgress && (
        (localQuestionProgress.q1Choices?.length > 0) ||
        (localQuestionProgress.q2Choices?.length > 0) ||
        (localQuestionProgress.q3Choices?.length > 0)
      );

      const totalLayers = 3;
      // Use the higher of backend or local progress
      const backendLayers = backendProgress?.completed_layers || 0;
      const completedLayers = Math.max(backendLayers, localCompletedLayers);
      const progressPercent = Math.round((completedLayers / totalLayers) * 100);

      return {
        id: question.id,
        title: question.title || question.id,
        description: question.question_text || 'Explore your values and preferences for this topic.',
        progress: progressPercent,
        layersCompleted: completedLayers,
        totalLayers: totalLayers,
        lastUpdated: backendProgress?.last_updated,
        imageUrl: question.image_url || question.thumbnail_url || null,
        thumbnailUrl: question.thumbnail_url || question.image_url || null,
        hasStarted: hasStartedLocal || completedLayers > 0,
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

  // Care Team Modal handlers
  const handleOpenAddTeamModal = useCallback(() => {
    setCreatedTeam(null);
    setIsAddTeamModalOpen(true);
  }, []);

  const handleCloseAddTeamModal = useCallback(() => {
    setIsAddTeamModalOpen(false);
    setCreatedTeam(null);
  }, []);

  const handleCreateTeam = useCallback(async (teamData) => {
    const response = await teamsService.createTeam(
      teamData.name,
      teamData.description || '',
      teamData.team_level || null
    );
    const result = response.data || response;
    setCreatedTeam(result.team);
    // Refresh teams list
    const teamsResponse = await teamsService.getTeams();
    let teamsData = teamsResponse;
    if (teamsResponse?.data) teamsData = teamsResponse.data;
    if (teamsResponse?.results) teamsData = teamsResponse.results;
    setCareTeams(Array.isArray(teamsData) ? teamsData : []);
    return result;
  }, []);

  const handleInviteMember = useCallback(async (inviteData) => {
    const teamId = createdTeam?.id;
    if (!teamId) {
      throw new Error('No team selected');
    }
    const response = await teamsService.inviteMember(teamId, inviteData.email, inviteData.role);
    return response.data || response;
  }, [createdTeam]);

  const getButtonText = (question) => {
    if (question.progress === 100) return 'Review';
    if (question.hasStarted || question.progress > 0) return 'Continue';
    return 'Start';
  };

  // Memoize transformed data to prevent recalculation on every render
  const displayQuestions = useMemo(() => getQuestionsWithProgress(), [questions, progressData, localProgress]);
  const recentSessions = useMemo(() => getRecentSessions(), [progressData]);
  const displayTeams = useMemo(() => getTransformedTeams(), [careTeams, questions]);

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
              <span className="welcome-label">Your Journey</span>
              <h1 className="welcome-title">
                Welcome back,  
                <span> </span>
                <span className="welcome-name">
                    {user.name}
                  <svg className="welcome-underline" viewBox="0 0 200 12" preserveAspectRatio="none">
                    <path d="M2 8 Q 50 2, 100 8 T 198 8" stroke="url(#underlineGradient)" strokeWidth="4" fill="none" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="underlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#fbbf24" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>
              <p className="welcome-subtitle">Continue planning your advance care directives</p>
            </div>
            <div className="welcome-visual">
              <div className="welcome-carousel">
                
                <div className="carousel-images">
                  {CAROUSEL_IMAGES.map((image, index) => (
                    <div
                      key={index}
                      className={`carousel-slide ${index === carouselIndex ? 'carousel-slide--active' : ''}`}
                    >
                      <img src={image.url} alt={image.alt} />
                    </div>
                  ))}
                </div>
               
                <div className="carousel-dots">
                  {CAROUSEL_IMAGES.map((_, index) => (
                    <button
                      key={index}
                      className={`carousel-dot ${index === carouselIndex ? 'carousel-dot--active' : ''}`}
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              <div className="welcome-stats">
                <div className="welcome-stat welcome-stat--progress">
                  <div className="stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">{user.overallProgress}%</span>
                    <span className="stat-label">Complete</span>
                  </div>
                </div>
                <div className="welcome-stat welcome-stat--questions">
                  <div className="stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                      <rect x="9" y="3" width="6" height="4" rx="1"/>
                      <path d="M9 12h6M9 16h6"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">{user.questionsCompleted}/{user.totalQuestions}</span>
                    <span className="stat-label">Questions</span>
                  </div>
                </div>
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
                <Link
                  key={question.id}
                  to={`/questionnaire/${question.id}`}
                  className="question-card"
                >
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
                </Link>
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
                  <div
                    key={team.id}
                    className="team-item"
                    onClick={() => navigate(`/team/${team.id}`)}
                  >
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
                  onClick={handleOpenAddTeamModal}
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
                  onClick={handleOpenAddTeamModal}
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

      {/* Add Care Team Modal */}
      <AddMemberModal
        isOpen={isAddTeamModalOpen}
        onClose={handleCloseAddTeamModal}
        onCreateTeam={handleCreateTeam}
        onInviteMember={handleInviteMember}
        teamId={createdTeam?.id}
        existingTeam={null}
        userName={authUser?.display_name || authUser?.first_name || userName}
        userAvatar={authUser?.profile_photo_url}
      />
    </div>
  );
}

export default Dashboard;
