import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';
import Button from '../../components/common/Button/Button';
import { ContentHeader } from '../../components/common/Navigation';
import { AddMemberModal } from '../../components/common/Modal';
import { questionsService, responsesService } from '../../services/questionnaire';
import { teamsService } from '../../services/teams';
import { recordingsService } from '../../services/recordings';
import { getAllProgress } from '../QuestionnaireFlow/utils/progressStorage';
import { getInitials, getColorFromString, formatRelativeDate } from '../../utils/formatters';
import WelcomeHeader from './WelcomeHeader';
import RecentSessions from './RecentSessions';
import QuestionsGrid from './QuestionsGrid';
import CareTeamsSidebar from './CareTeamsSidebar';
import RecordingsSidebar from './RecordingsSidebar';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth();

  // State for data
  const [questions, setQuestions] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [careTeams, setCareTeams] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [localProgress, setLocalProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Care Team Modal state
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [createdTeam, setCreatedTeam] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !authUser) {
      navigate('/login');
    }
  }, [authUser, authLoading, navigate]);

  // Load localStorage progress immediately
  useEffect(() => {
    setLocalProgress(getAllProgress());
  }, []);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [questionsResponse, progressResponse, teamsResponse, recordingsResponse] = await Promise.all([
          questionsService.getAll().catch(err => ({ data: [] })),
          responsesService.getSummary().catch(err => ({ data: [] })),
          teamsService.getTeams().catch(err => []),
          recordingsService.getMyRecordings().catch(err => [])
        ]);

        let questionsData = questionsResponse.data || [];
        if (questionsData.results) questionsData = questionsData.results;
        if (!Array.isArray(questionsData)) questionsData = [];
        setQuestions(questionsData);
        setProgressData(progressResponse.data || []);

        let teamsData = teamsResponse;
        if (teamsResponse?.data) teamsData = teamsResponse.data;
        if (teamsResponse?.results) teamsData = teamsResponse.results;
        setCareTeams(Array.isArray(teamsData) ? teamsData : []);

        let recordingsData = recordingsResponse;
        if (recordingsResponse?.data) recordingsData = recordingsResponse.data;
        if (recordingsResponse?.results) recordingsData = recordingsResponse.results;
        setRecordings(Array.isArray(recordingsData) ? recordingsData.slice(0, 3) : []);
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
  const getQuestionsWithProgress = useCallback(() => {
    if (!Array.isArray(questions)) return [];

    return questions.map(question => {
      const backendProgress = progressData.find(p => p.question_id === question.id);
      const localQuestionProgress = localProgress[question.id];

      let localCompletedLayers = 0;
      if (localQuestionProgress?.completedCheckpoints) {
        const cp = localQuestionProgress.completedCheckpoints;
        if (cp.q1) localCompletedLayers++;
        if (cp.q2) localCompletedLayers++;
        if (cp.q3) localCompletedLayers++;
      }

      const hasStartedLocal = localQuestionProgress && (
        (localQuestionProgress.q1Choices?.length > 0) ||
        (localQuestionProgress.q2Choices?.length > 0) ||
        (localQuestionProgress.q3Choices?.length > 0)
      );

      const totalLayers = 3;
      const backendLayers = backendProgress?.completed_layers || 0;
      const completedLayers = Math.max(backendLayers, localCompletedLayers);
      const progressPercent = Math.round((completedLayers / totalLayers) * 100);

      return {
        id: question.id,
        title: question.title || question.id,
        description: question.question_text || 'Explore your values and preferences for this topic.',
        progress: progressPercent,
        layersCompleted: completedLayers,
        totalLayers,
        lastUpdated: backendProgress?.last_updated,
        imageUrl: question.image_url || question.thumbnail_url || null,
        thumbnailUrl: question.thumbnail_url || question.image_url || null,
        hasStarted: hasStartedLocal || completedLayers > 0,
      };
    });
  }, [questions, progressData, localProgress]);

  // Get recent sessions
  const getRecentSessions = useCallback(() => {
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
  }, [progressData]);

  // Transform care teams
  const getTransformedTeams = useCallback(() => {
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
      questionsAnswered: 0,
      totalQuestions: questions.length || 4,
    }));
  }, [careTeams, questions]);

  // Calculate overall progress
  const getOverallProgress = useCallback(() => {
    const questionsWithProgress = getQuestionsWithProgress();
    if (questionsWithProgress.length === 0) return { progress: 0, completed: 0, total: 0 };

    const completed = questionsWithProgress.filter(q => q.progress === 100).length;
    const progress = Math.round(
      questionsWithProgress.reduce((sum, q) => sum + q.progress, 0) / questionsWithProgress.length
    );

    return { progress, completed, total: questionsWithProgress.length };
  }, [getQuestionsWithProgress]);

  // Handlers
  const handleQuestionClick = useCallback((questionId) => {
    navigate(`/questionnaire/${questionId}`);
  }, [navigate]);

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
    const teamsResponse = await teamsService.getTeams();
    let teamsData = teamsResponse?.data || teamsResponse?.results || teamsResponse;
    setCareTeams(Array.isArray(teamsData) ? teamsData : []);
    return result;
  }, []);

  const handleInviteMember = useCallback(async (inviteData) => {
    const teamId = createdTeam?.id;
    if (!teamId) throw new Error('No team selected');
    const response = await teamsService.inviteMember(teamId, inviteData.email, inviteData.role);
    return response.data || response;
  }, [createdTeam]);

  // Memoized data
  const overallStats = useMemo(() => getOverallProgress(), [getOverallProgress]);
  const displayQuestions = useMemo(() => getQuestionsWithProgress(), [getQuestionsWithProgress]);
  const recentSessions = useMemo(() => getRecentSessions(), [getRecentSessions]);
  const displayTeams = useMemo(() => getTransformedTeams(), [getTransformedTeams]);

  const userName = authUser?.display_name || authUser?.email?.split('@')[0] || 'User';

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
        {/* LEFT COLUMN - Main Content */}
        <div className="dashboard-main">
          <WelcomeHeader
            userName={userName}
            overallProgress={overallStats.progress}
            questionsCompleted={overallStats.completed}
            totalQuestions={overallStats.total || 4}
          />

          <RecentSessions
            sessions={recentSessions}
            onQuestionClick={handleQuestionClick}
          />

          <QuestionsGrid
            questions={displayQuestions}
            onQuestionClick={handleQuestionClick}
          />
        </div>

        {/* RIGHT COLUMN - Sidebar */}
        <div className="dashboard-sidebar">
          <CareTeamsSidebar
            teams={displayTeams}
            onAddTeam={handleOpenAddTeamModal}
          />

          <RecordingsSidebar recordings={recordings} />
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
