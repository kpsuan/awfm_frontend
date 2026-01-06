import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Heart,
  MessageSquare,
  Share2,
  Clock,
  Video,
  Mic,
  FileText,
  X,
  Play,
  Pause,
  Send,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import './TeamRecordings.css';
import { recordingsService, teamsService } from '../../../services';
import { TeamSelector } from '../../common/TeamSelector';
import { AudioWaveform } from '../../common/Recording';
import FeedbackModal, { hasFeedbackBeenSubmitted } from '../../common/Modal/FeedbackModal';

// Custom gradient icons (keeping gradient styling)
const HeartIcon = ({ filled }) => (
  <Heart size={20} fill={filled ? "currentColor" : "none"} className={filled ? "icon-gradient" : ""} />
);

const CommentIcon = () => (
  <MessageSquare size={20} className="icon-gradient" />
);

const ShareIcon = () => (
  <Share2 size={20} className="icon-gradient" />
);

const AiIcon = () => (
  <Clock size={20} className="icon-gradient" />
);

const VideoIcon = () => (
  <Video size={24} />
);

const MicIcon = () => (
  <Mic size={24} />
);

const TextIcon = () => (
  <FileText size={24} />
);

const CloseIcon = () => (
  <X size={24} />
);

const PlayIcon = () => (
  <Play size={48} fill="white" color="white" />
);

const SendIcon = () => (
  <Send size={20} />
);

// Comments Panel Component
const CommentsPanel = ({ isOpen, onClose, userName, comments = [] }) => {
  const [newComment, setNewComment] = useState('');

  const mockComments = [
    { id: 1, user: 'Dr. Sarah', avatar: 'https://i.pravatar.cc/40?img=1', text: 'Thank you for sharing your perspective. This helps me understand your values better.', time: '2h ago' },
    { id: 2, user: 'Mary', avatar: 'https://i.pravatar.cc/40?img=3', text: 'I appreciate you being so open about this.', time: '1h ago' },
    { id: 3, user: 'John', avatar: 'https://i.pravatar.cc/40?img=2', text: 'This really helped me understand where you\'re coming from.', time: '30m ago' },
  ];

  if (!isOpen) return null;

  return (
    <div className="team-recordings__panel-overlay" onClick={onClose}>
      <div className="team-recordings__panel team-recordings__panel--comments" onClick={e => e.stopPropagation()}>
        <div className="team-recordings__panel-header">
          <h3>Comments</h3>
          <button className="team-recordings__panel-close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="team-recordings__comments-list">
          {mockComments.map(comment => (
            <div key={comment.id} className="team-recordings__comment">
              <img src={comment.avatar} alt={comment.user} className="team-recordings__comment-avatar" />
              <div className="team-recordings__comment-content">
                <div className="team-recordings__comment-header">
                  <span className="team-recordings__comment-user">{comment.user}</span>
                  <span className="team-recordings__comment-time">{comment.time}</span>
                </div>
                <p className="team-recordings__comment-text">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="team-recordings__comment-input">
          <input 
            type="text" 
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="team-recordings__comment-send" disabled={!newComment.trim()}>
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

// Check Icon for affirmed items
const CheckCircleIcon = () => (
  <CheckCircle size={18} className="icon-gradient-purple" />
);

// Profile Summary Panel Component
const ProfileSummaryPanel = ({ isOpen, onClose, member, isCurrentUser, onAffirm, hasAffirmed, onViewFullReport }) => {
  if (!isOpen || !member) return null;

  // Mock summary data - in real app this would come from member data
  const summaryData = {
    reflections: [
      {
        id: 1,
        title: 'Reflection 1: Your Position',
        items: ['Life extension is very important regardless of function']
      },
      {
        id: 2,
        title: 'Reflection 2: Your Challenges',
        items: [
          'Worried about becoming a burden to loved ones',
          'Worried doctors might undervalue my life with disability'
        ]
      },
      {
        id: 3,
        title: 'Reflection 3: What Would Change Your Mind',
        items: ['Meeting people with disabilities living meaningful lives']
      }
    ],
    affirmations: [
      { id: 1, name: 'Sarah', avatar: 'https://i.pravatar.cc/60?img=1', affirmed: true },
      { id: 2, name: 'John', avatar: 'https://i.pravatar.cc/60?img=2', affirmed: false },
      { id: 3, name: 'Mary', avatar: 'https://i.pravatar.cc/60?img=3', affirmed: false },
    ]
  };

  return (
    <div className="team-recordings__panel-overlay" onClick={onClose}>
      <div className="team-recordings__panel team-recordings__panel--profile" onClick={e => e.stopPropagation()}>
        <div className="team-recordings__panel-header">
          <h3>{member.name}'s Summary</h3>
          <button className="team-recordings__panel-close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        
        <div className="team-recordings__profile-content">
          {/* Reflections */}
          {summaryData.reflections.map(reflection => (
            <div key={reflection.id} className="team-recordings__profile-section">
              <h4 className="team-recordings__profile-section-title">{reflection.title}</h4>
              <ul className="team-recordings__profile-items">
                {reflection.items.map((item, idx) => (
                  <li key={idx} className="team-recordings__profile-item">
                    <CheckCircleIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Affirmations Section */}
          <div className="team-recordings__profile-section">
            <h4 className="team-recordings__profile-section-title team-recordings__profile-section-title--affirm">
              Who has affirmed their commitment
            </h4>
            <p className="team-recordings__profile-affirm-note">
              Colored profiles indicate affirmation. Gray profiles indicate no affirmation yet.
            </p>
            <div className="team-recordings__profile-avatars">
              {summaryData.affirmations.map(person => (
                <div 
                  key={person.id} 
                  className={`team-recordings__profile-avatar ${person.affirmed ? 'affirmed' : ''}`}
                >
                  <img src={person.avatar} alt={person.name} />
                </div>
              ))}
            </div>
          </div>

          {/* Affirm Button - only show when viewing other people's profiles */}
          {!isCurrentUser && (
            <button 
              className={`team-recordings__affirm-btn ${hasAffirmed ? 'affirmed' : ''}`}
              onClick={onAffirm}
            >
              <span className="btn-text-default">
                {hasAffirmed ? 'Commitment Affirmed' : 'Affirm Commitment'}
              </span>
              {hasAffirmed && (
                <span className="btn-text-hover">Undo</span>
              )}
            </button>
          )}

          {/* View Full Report Button */}
          <button 
            className="team-recordings__view-report-btn"
            onClick={() => onViewFullReport && onViewFullReport(member)}
          >
            View Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

// Ask AI Panel Component
const AskAIPanel = ({ isOpen, onClose, userName }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);

  const prompts = [
    { id: 1, text: 'Explain this recording', icon: '💡' },
    { id: 2, text: 'Compare with my response', icon: '🔄' },
    { id: 3, text: 'What does this mean for my care?', icon: '❤️' },
    { id: 4, text: 'Summarize key points', icon: '📝' },
    { id: 5, text: 'How do our views differ?', icon: '🤔' },
  ];

  const handlePromptClick = (prompt) => {
    setMessages([
      ...messages,
      { type: 'user', text: prompt.text },
      { type: 'ai', text: `This is a placeholder response for "${prompt.text}". In a real implementation, this would connect to an AI service to provide insights about ${userName}'s recording and how it relates to your care preferences.` }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="team-recordings__panel-overlay" onClick={onClose}>
      <div className="team-recordings__panel team-recordings__panel--ai" onClick={e => e.stopPropagation()}>
        <div className="team-recordings__panel-header">
          <h3>Ask AI</h3>
          <button className="team-recordings__panel-close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        
        <div className="team-recordings__ai-content">
          {messages.length === 0 ? (
            <div className="team-recordings__ai-prompts">
              <p className="team-recordings__ai-intro">Choose a prompt or ask your own question about {userName}'s response:</p>
              <div className="team-recordings__ai-prompt-grid">
                {prompts.map(prompt => (
                  <button 
                    key={prompt.id} 
                    className="team-recordings__ai-prompt"
                    onClick={() => handlePromptClick(prompt)}
                  >
                    <span className="team-recordings__ai-prompt-icon">{prompt.icon}</span>
                    <span>{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="team-recordings__ai-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`team-recordings__ai-message team-recordings__ai-message--${msg.type}`}>
                  {msg.text}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="team-recordings__ai-input">
          <input 
            type="text" 
            placeholder="Ask a question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="team-recordings__ai-send" disabled={!query.trim()}>
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

// Recording Card Component - With glassmorphism overlay for name
const RecordingCard = ({ recording, isActive, member, onAvatarClick, onNameClick }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const handlePlayPause = () => {
    if (recording?.type === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    } else if (recording?.type === 'audio' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  // Handle empty recordings state
  if (!recording) {
    return (
      <div className={`team-recordings__card ${isActive ? 'team-recordings__card--active' : ''}`}>
        <div className="team-recordings__card-avatar" onClick={onAvatarClick}>
          <img src={member?.avatar} alt={member?.name} />
        </div>
        <div className="team-recordings__card-empty">
          <p>No recordings yet</p>
        </div>
        <div className="team-recordings__card-overlay" onClick={onNameClick}>
          <h3 className="team-recordings__card-name">{member?.name}</h3>
          <p className="team-recordings__card-desc">{member?.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`team-recordings__card ${isActive ? 'team-recordings__card--active' : ''}`}>
      {/* Avatar at top-left */}
      <div className="team-recordings__card-avatar" onClick={onAvatarClick}>
        <img src={member?.avatar} alt={member?.name} />
      </div>

      {/* Recording content */}
      {recording.type === 'video' && (
        <div className={`team-recordings__card-video ${isPlaying ? 'is-playing' : ''}`}>
          {recording.mediaUrl ? (
            <>
              <video
                ref={videoRef}
                src={recording.mediaUrl}
                poster={recording.thumbnail}
                onEnded={handleEnded}
                playsInline
                onClick={handlePlayPause}
              />
              {!isPlaying && recording.thumbnail && (
                <img src={recording.thumbnail} alt="Recording thumbnail" className="team-recordings__card-poster" />
              )}
            </>
          ) : recording.thumbnail ? (
            <img src={recording.thumbnail} alt="Recording thumbnail" />
          ) : (
            <div className="team-recordings__card-placeholder">
              <VideoIcon />
            </div>
          )}
          <button className="team-recordings__card-play" onClick={handlePlayPause}>
            {isPlaying ? (
              <Pause size={48} fill="white" color="white" />
            ) : (
              <PlayIcon />
            )}
          </button>
        </div>
      )}
      {recording.type === 'audio' && (
        <div className="team-recordings__card-audio">
          {recording.mediaUrl && (
            <audio
              ref={audioRef}
              src={recording.mediaUrl}
              onEnded={handleEnded}
            />
          )}
          <AudioWaveform
            isPlaying={isPlaying}
            barCount={20}
            className="team-recordings__card-audio-wave"
          />
          <button className="team-recordings__card-play" onClick={handlePlayPause}>
            {isPlaying ? (
              <Pause size={48} fill="white" color="white" />
            ) : (
              <PlayIcon />
            )}
          </button>
        </div>
      )}
      {recording.type === 'text' && (
        <div className="team-recordings__card-text">
          <p>{recording.content}</p>
        </div>
      )}

      {/* Glassmorphism overlay with name/description */}
      <div className="team-recordings__card-overlay" onClick={onNameClick}>
        <h3 className="team-recordings__card-name">{member?.name}</h3>
        <p className="team-recordings__card-desc">{recording.description || member?.description}</p>
      </div>
    </div>
  );
};

// Back Arrow Icon
const BackArrowIcon = () => (
  <ArrowLeft size={20} />
);

// Helper to format count numbers
const formatCount = (count) => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
};

// Helper to group recordings by user
const groupRecordingsByUser = (recordings, currentUserId) => {
  const userMap = new Map();

  recordings.forEach(rec => {
    const userId = rec.user;
    if (!userMap.has(userId)) {
      userMap.set(userId, {
        id: userId,
        name: rec.user_name || 'Unknown User',
        avatar: rec.user_avatar || `https://i.pravatar.cc/125?u=${userId}`,
        description: rec.description || 'Shared their perspective',
        isCurrentUser: userId === currentUserId,
        recordings: [],
        stats: { likes: 0, comments: 0, shares: 0 }
      });
    }

    const user = userMap.get(userId);
    user.recordings.push({
      id: rec.id,
      type: rec.recording_type,
      mediaUrl: rec.media_url,
      thumbnail: rec.thumbnail_url,
      content: rec.text_content,
      description: rec.description,
      duration: rec.duration,
      likesCount: rec.likes_count || 0,
      commentsCount: rec.comments_count || 0,
      affirmationsCount: rec.affirmations_count || 0,
      userHasLiked: rec.user_has_liked || false,
      userHasAffirmed: rec.user_has_affirmed || false,
    });

    // Aggregate stats
    user.stats.likes += rec.likes_count || 0;
    user.stats.comments += rec.comments_count || 0;
  });

  // Sort to put current user first
  const users = Array.from(userMap.values());
  users.sort((a, b) => {
    if (a.isCurrentUser) return -1;
    if (b.isCurrentUser) return 1;
    return 0;
  });

  return users;
};

// Main Component
const TeamRecordings = ({
  onSkip,
  onBack,
  onBackHome,
  onBackToSummary,
  onRecordVideo,
  onRecordAudio,
  onEnterText,
  onViewFullReport,
  currentUser = null,
  team = null,
  questionId = null,
  // Legacy props for multiple teams support
  teams = [],
  selectedTeamId = null,
  onSelectTeam,
}) => {
  const [activeTeamMemberIndex, setActiveTeamMemberIndex] = useState(0);
  const [activeRecordingIndex, setActiveRecordingIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showAskAI, setShowAskAI] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [liked, setLiked] = useState({});
  const [affirmed, setAffirmed] = useState({});
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const carouselRef = useRef(null);

  // API data state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [fetchedTeams, setFetchedTeams] = useState([]);
  const [selectedFetchedTeamId, setSelectedFetchedTeamId] = useState(null);

  // Get the currently selected team from fetched teams
  const fetchedTeam = fetchedTeams.find(t => t.id === selectedFetchedTeamId) || fetchedTeams[0] || null;

  // Use provided team or fetched team
  const activeTeam = team || fetchedTeam;

  // Fetch user's teams if not provided (only on mount)
  useEffect(() => {
    const fetchTeamData = async () => {
      if (team) return; // Already have team prop

      try {
        const response = await teamsService.getTeams();
        // Handle DRF pagination format { results: [...] } or direct array
        const teamsData = response.results || response.data || (Array.isArray(response) ? response : []);
        setFetchedTeams(teamsData);
        if (teamsData.length > 0) {
          setSelectedFetchedTeamId(teamsData[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch teams:', err);
      }
    };

    fetchTeamData();
  }, [team]); // Only depend on team prop, not selectedFetchedTeamId

  // Fetch recordings from API
  const fetchRecordings = useCallback(async () => {
    if (!activeTeam?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await recordingsService.getTeamRecordings(activeTeam.id);
      const recordings = response.data || response || [];

      // Group recordings by user
      const currentUserId = currentUser?.id || currentUser?.user_id;
      const groupedUsers = groupRecordingsByUser(recordings, currentUserId);

      // If current user has no recordings yet, add them with empty recordings
      if (currentUser && !groupedUsers.some(u => u.isCurrentUser)) {
        groupedUsers.unshift({
          id: currentUserId,
          name: currentUser.full_name || currentUser.name || 'You',
          avatar: currentUser.avatar_url || currentUser.avatar || `https://i.pravatar.cc/125?u=${currentUserId}`,
          description: 'Share your perspective',
          isCurrentUser: true,
          recordings: [],
          stats: { likes: 0, comments: 0, shares: 0 }
        });
      }

      setTeamMembers(groupedUsers);

      // Initialize liked/affirmed state from API data
      const initialLiked = {};
      const initialAffirmed = {};
      recordings.forEach(rec => {
        if (rec.user_has_liked) initialLiked[rec.id] = true;
        if (rec.user_has_affirmed) initialAffirmed[rec.id] = true;
      });
      setLiked(initialLiked);
      setAffirmed(initialAffirmed);

    } catch (err) {
      console.error('Failed to fetch team recordings:', err);
      setError(err.message || 'Failed to load recordings');
    } finally {
      setIsLoading(false);
    }
  }, [activeTeam?.id, currentUser]);

  // Fetch on mount and when team changes
  useEffect(() => {
    fetchRecordings();
  }, [fetchRecordings]);

  // Default/fallback team data if API returns empty
  // Transform fetched teams to display format
  const transformedFetchedTeams = fetchedTeams.map(t => ({
    id: t.id,
    name: t.name || 'Care Team',
    avatar: t.avatar_url || 'https://i.pravatar.cc/60?img=10',
    memberCount: t.member_count || 0,
  }));

  const defaultTeam = activeTeam ? {
    id: activeTeam.id,
    name: activeTeam.name || 'Care Team',
    avatar: activeTeam.avatar_url || 'https://i.pravatar.cc/60?img=10',
    memberCount: teamMembers.length,
  } : {
    id: 'default',
    name: 'Loading...',
    avatar: 'https://i.pravatar.cc/60?img=10',
    memberCount: 0,
  };

  // Use props teams, or fetched teams, or fallback to default
  const displayTeams = teams.length > 0 ? teams : (transformedFetchedTeams.length > 0 ? transformedFetchedTeams : [defaultTeam]);
  const [currentTeamId, setCurrentTeamId] = useState(selectedTeamId || activeTeam?.id || displayTeams[0]?.id);

  // Update currentTeamId when activeTeam is fetched
  useEffect(() => {
    if (activeTeam?.id && !currentTeamId) {
      setCurrentTeamId(activeTeam.id);
    }
  }, [activeTeam?.id, currentTeamId]);

  // Reset member index when team changes
  useEffect(() => {
    setActiveTeamMemberIndex(0);
    setActiveRecordingIndex(0);
  }, [currentTeamId]);

  const handleTeamChange = (teamId) => {
    setCurrentTeamId(teamId);
    // Update fetched team selection if using fetched teams
    if (fetchedTeams.length > 0) {
      setSelectedFetchedTeamId(teamId);
    }
    if (onSelectTeam) {
      onSelectTeam(teamId);
    }
  };

  // Get active member and recording safely
  const activeMember = teamMembers[activeTeamMemberIndex] || {
    id: 'placeholder',
    name: 'Loading...',
    avatar: 'https://i.pravatar.cc/125',
    description: '',
    isCurrentUser: false,
    recordings: [],
    stats: { likes: 0, comments: 0, shares: 0 }
  };
  const activeRecording = activeMember.recordings?.[activeRecordingIndex] || null;

  const handleSwipe = (direction) => {
    if (direction === 'left' && activeTeamMemberIndex < teamMembers.length - 1) {
      setActiveTeamMemberIndex(prev => prev + 1);
      setActiveRecordingIndex(0);
    } else if (direction === 'right' && activeTeamMemberIndex > 0) {
      setActiveTeamMemberIndex(prev => prev - 1);
      setActiveRecordingIndex(0);
    }
  };

  const handleRecordingDotClick = (index) => {
    setActiveRecordingIndex(index);
  };

  // Handle like with API call
  const handleLike = useCallback(async () => {
    if (!activeRecording?.id) return;

    const recordingId = activeRecording.id;
    const wasLiked = liked[recordingId];

    // Optimistic update
    setLiked(prev => ({
      ...prev,
      [recordingId]: !prev[recordingId]
    }));

    try {
      await recordingsService.toggleLike(recordingId);
    } catch (err) {
      // Revert on error
      console.error('Failed to toggle like:', err);
      setLiked(prev => ({
        ...prev,
        [recordingId]: wasLiked
      }));
    }
  }, [activeRecording?.id, liked]);

  // Handle affirm with API call
  const handleAffirm = useCallback(async () => {
    if (!activeRecording?.id) return;

    const recordingId = activeRecording.id;
    const wasAffirmed = affirmed[recordingId];

    // Optimistic update
    setAffirmed(prev => ({
      ...prev,
      [recordingId]: !prev[recordingId]
    }));

    try {
      await recordingsService.toggleAffirmation(recordingId);
    } catch (err) {
      // Revert on error
      console.error('Failed to toggle affirmation:', err);
      setAffirmed(prev => ({
        ...prev,
        [recordingId]: wasAffirmed
      }));
    }
  }, [activeRecording?.id, affirmed]);

  const handleNameClick = () => {
    setShowProfile(true);
  };

  // Handle back button - show feedback modal if not submitted yet
  const handleBackClick = () => {
    if (!hasFeedbackBeenSubmitted()) {
      setShowFeedbackModal(true);
    } else {
      // Feedback already submitted, go directly to dashboard
      if (onBackHome) onBackHome();
      else if (onBack) onBack();
    }
  };

  // Handle feedback modal close - navigate to dashboard
  const handleFeedbackClose = () => {
    setShowFeedbackModal(false);
    if (onBackHome) onBackHome();
    else if (onBack) onBack();
  };

  // Touch handling for swipe
  const touchStartX = useRef(0);
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      handleSwipe(diff > 0 ? 'left' : 'right');
    }
  };

  return (
    <div className="team-recordings">
      {/* Header with Back Button and Team Selector */}
      <div className="team-recordings__header">
        <button
          className="team-recordings__back-btn"
          onClick={handleBackClick}
          aria-label="Go back"
        >
          <BackArrowIcon />
        </button>

        {displayTeams.length > 0 && (
          <TeamSelector
            teams={displayTeams}
            selectedTeamId={currentTeamId}
            onSelectTeam={handleTeamChange}
            isOpen={showTeamDropdown}
            onToggle={() => setShowTeamDropdown(!showTeamDropdown)}
            label=""
            className="team-recordings__team-selector"
          />
        )}

        <div className="team-recordings__header-spacer" />
      </div>

      {/* Background */}
      <div className="team-recordings__background"></div>

      {/* Loading State */}
      {isLoading && (
        <div className="team-recordings__loading">
          <div className="team-recordings__loading-spinner" />
          <p>Loading team recordings...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="team-recordings__error">
          <p>Failed to load recordings</p>
          <button onClick={fetchRecordings}>Try Again</button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && teamMembers.length === 0 && (
        <div className="team-recordings__empty">
          <p>No recordings yet</p>
          <p>Be the first to share your perspective!</p>
        </div>
      )}

      {/* Recording Carousel - only show when data is loaded */}
      {!isLoading && !error && teamMembers.length > 0 && (
      <div
        className="team-recordings__carousel"
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="team-recordings__carousel-track"
          style={{ '--active-index': activeTeamMemberIndex }}
        >
          {teamMembers.map((member, memberIdx) => (
            <div
              key={member.id}
              className={`team-recordings__carousel-slide ${memberIdx === activeTeamMemberIndex ? 'active' : ''}`}
            >
              <RecordingCard
                recording={member.recordings[memberIdx === activeTeamMemberIndex ? activeRecordingIndex : 0]}
                isActive={memberIdx === activeTeamMemberIndex}
                member={member}
                onAvatarClick={() => {
                  if (memberIdx === activeTeamMemberIndex) {
                    setShowProfile(true);
                  }
                }}
                onNameClick={() => {
                  if (memberIdx === activeTeamMemberIndex) {
                    setShowProfile(true);
                  }
                }}
              />
            </div>
          ))}
        </div>

        {/* Recording Indicator Dots (like Instagram stories) */}
        {activeMember.recordings.length > 1 && (
          <div className="team-recordings__recording-indicators">
            {activeMember.recordings.map((_, idx) => (
              <button
                key={idx}
                className={`team-recordings__recording-dot ${idx === activeRecordingIndex ? 'active' : ''}`}
                onClick={() => handleRecordingDotClick(idx)}
              />
            ))}
          </div>
        )}

        {/* Navigation Arrows (desktop) */}
        {activeTeamMemberIndex > 0 && (
          <button 
            className="team-recordings__nav-btn team-recordings__nav-btn--prev"
            onClick={() => handleSwipe('right')}
          >
            ‹
          </button>
        )}
        {activeTeamMemberIndex < teamMembers.length - 1 && (
          <button 
            className="team-recordings__nav-btn team-recordings__nav-btn--next"
            onClick={() => handleSwipe('left')}
          >
            ›
          </button>
        )}
      </div>
      )}

      {/* User Info */}
      {!isLoading && !error && teamMembers.length > 0 && (
      <div className="team-recordings__user-info">
        <div className="team-recordings__avatar" onClick={handleNameClick}>
          <img src={activeMember.avatar} alt={activeMember.name} />
        </div>
        <h2 className="team-recordings__name team-recordings__name--clickable" onClick={handleNameClick}>
          {activeMember.name}
        </h2>
        <p className="team-recordings__description">{activeMember.description}</p>

        {/* Affirm Button - Only for other team members */}
        {!activeMember.isCurrentUser && activeRecording && (
          <button
            className={`team-recordings__affirm-btn ${affirmed[activeRecording.id] ? 'affirmed' : ''}`}
            onClick={handleAffirm}
          >
            <span className="btn-text-default">
              {affirmed[activeRecording.id] ? 'Commitment Affirmed' : 'Affirm Commitment'}
            </span>
            {affirmed[activeRecording.id] && (
              <span className="btn-text-hover">Undo</span>
            )}
          </button>
        )}

        {/* Social Interactions */}
        <div className="team-recordings__social">
          <button
            className={`team-recordings__social-btn ${activeRecording && liked[activeRecording.id] ? 'liked' : ''}`}
            onClick={handleLike}
          >
            <HeartIcon filled={activeRecording && liked[activeRecording.id]} />
            <span>{formatCount(activeMember.stats.likes)}</span>
          </button>
          <button
            className="team-recordings__social-btn"
            onClick={() => setShowComments(true)}
          >
            <CommentIcon />
            <span>{formatCount(activeMember.stats.comments)}</span>
          </button>
          <button className="team-recordings__social-btn">
            <ShareIcon />
            <span>{formatCount(activeMember.stats.shares)}</span>
          </button>
          <button 
            className="team-recordings__social-btn team-recordings__social-btn--ai"
            onClick={() => setShowAskAI(true)}
          >
            <AiIcon />
            <span>Ask AI</span>
          </button>
        </div>

        {/* Record Options - Only for current user */}
        {activeMember.isCurrentUser && (
          <div className="team-recordings__record-options">
            <button className="team-recordings__record-option" onClick={onRecordVideo}>
              <div className="team-recordings__record-icon">
                <VideoIcon />
              </div>
              <span>RECORD<br/>VIDEO</span>
            </button>
            <button className="team-recordings__record-option" onClick={onRecordAudio}>
              <div className="team-recordings__record-icon">
                <MicIcon />
              </div>
              <span>RECORD<br/>AUDIO</span>
            </button>
            <button className="team-recordings__record-option" onClick={onEnterText}>
              <div className="team-recordings__record-icon">
                <TextIcon />
              </div>
              <span>ENTER<br/>TEXT</span>
            </button>
          </div>
        )}
      </div>
      )}

      {/* Team Member Dots */}
      {!isLoading && !error && teamMembers.length > 0 && (
      <div className="team-recordings__team-dots">
        {teamMembers.map((member, idx) => (
          <button
            key={member.id}
            className={`team-recordings__team-dot ${idx === activeTeamMemberIndex ? 'active' : ''}`}
            onClick={() => {
              setActiveTeamMemberIndex(idx);
              setActiveRecordingIndex(0);
            }}
          >
            <img src={member.avatar} alt={member.name} />
          </button>
        ))}
      </div>
      )}

      {/* Action Buttons */}
      <div className="team-recordings__actions">
        {onBackToSummary && (
          <button className="team-recordings__summary-btn" onClick={onBackToSummary}>
            Back to Summary
          </button>
        )}
        <button className="team-recordings__skip-btn" onClick={handleBackClick}>
          Back to Home
        </button>
      </div>

      {/* Panels */}
      <CommentsPanel 
        isOpen={showComments} 
        onClose={() => setShowComments(false)}
        userName={activeMember.name}
      />
      <AskAIPanel 
        isOpen={showAskAI} 
        onClose={() => setShowAskAI(false)}
        userName={activeMember.name}
      />
      <ProfileSummaryPanel
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        member={activeMember}
        isCurrentUser={activeMember.isCurrentUser}
        onAffirm={handleAffirm}
        hasAffirmed={activeRecording ? affirmed[activeRecording.id] : false}
        onViewFullReport={onViewFullReport}
      />

      {/* Feedback Modal - shown when clicking back */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={handleFeedbackClose}
        onSkip={handleFeedbackClose}
      />
    </div>
  );
};

export default TeamRecordings;
