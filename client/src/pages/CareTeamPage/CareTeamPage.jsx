import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth, useNotifications } from '../../context';
import { teamsService, recordingsService } from '../../services';
import { ContentHeader } from '../../components/common/Navigation';
import { AddMemberModal, ShareModal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import {
  UserPlusIcon, ShareIcon, ChevronDownIcon,
  BellIcon, LogOutIcon, LockIcon, CheckCircleIcon
} from '../../components/common/Icons';
import { getInitials, getColorFromString } from '../../utils/formatters';
import PostsTab from './PostsTab';
import MembersTab from './MembersTab';
import AboutTab from './AboutTab';
import MediaTab from './MediaTab';
import './CareTeamPage.css';

function CareTeamPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { teamActivities } = useNotifications();

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showJoinedDropdown, setShowJoinedDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  const fetchTeamData = useCallback(async () => {
    try {
      setLoading(true);
      const [teamData, recordingsData] = await Promise.all([
        teamsService.getTeam(teamId),
        recordingsService.getTeamRecordings(teamId),
      ]);

      setTeam(teamData);
      setMembers(teamData.members || []);
      setRecordings(recordingsData.data || recordingsData.results || recordingsData || []);
    } catch (err) {
      console.error('Failed to fetch team data:', err);
      setError('Failed to load team. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    if (teamId) {
      fetchTeamData();
    }
  }, [teamId, fetchTeamData]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showJoinedDropdown && !e.target.closest('.joined-dropdown')) {
        setShowJoinedDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showJoinedDropdown]);

  const handleLike = async (recordingId) => {
    try {
      const result = await recordingsService.toggleLike(recordingId);
      setRecordings(prev =>
        prev.map(r => r.id === recordingId
          ? { ...r, user_has_liked: result.data?.liked, likes_count: result.data?.likes_count }
          : r
        )
      );
    } catch (err) {
      toast.error('Failed to like recording');
    }
  };

  const handleAffirm = async (recordingId) => {
    try {
      const result = await recordingsService.toggleAffirmation(recordingId);
      setRecordings(prev =>
        prev.map(r => r.id === recordingId
          ? { ...r, user_has_affirmed: result.data?.affirmed, affirmations_count: result.data?.affirmations_count }
          : r
        )
      );
      if (result.data?.affirmed) {
        toast.success('You affirmed this recording!');
      }
    } catch (err) {
      toast.error('Failed to affirm recording');
    }
  };

  const handleLeaveTeam = async () => {
    if (window.confirm('Are you sure you want to leave this team?')) {
      try {
        await teamsService.leaveTeam(teamId);
        toast.success('You have left the team');
        navigate('/');
      } catch (err) {
        toast.error('Failed to leave team');
      }
    }
  };

  const currentMembership = members.find(m => m.user_id === user?.id || m.user?.id === user?.id);
  const isLeader = currentMembership?.role === 'leader';

  const displayMembers = members.slice(0, 10);
  const remainingCount = members.length - displayMembers.length;

  const userLookup = useMemo(() => {
    const lookup = {};
    members.forEach(member => {
      const memberUser = member.user || member;
      const oduserId = member.user_id || memberUser.id;
      if (oduserId) {
        lookup[oduserId] = {
          id: oduserId,
          display_name: memberUser.display_name,
          profile_photo_url: memberUser.profile_photo_url,
          photo_url: memberUser.photo_url,
          role: member.role,
        };
      }
    });
    return lookup;
  }, [members]);

  if (loading) {
    return (
      <div className="care-team-page">
        <div className="care-team-page__loading">Loading team...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="care-team-page">
        <div className="care-team-page__error">{error}</div>
      </div>
    );
  }

  return (
    <div className="care-team-page">
      <ContentHeader />

      {/* Header */}
      <header className="team-header">
        <div className="team-header__banner">
          <img
            src="https://picsum.photos/1200/400?random=1"
            alt="Team banner"
            className="team-header__banner-img"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="team-header__banner-overlay" />
        </div>

        <div className="team-header__content">
          <div className="team-header__info">
            <span className="team-header__label">{team?.team_level || team?.level || 'Team'}</span>
            <h1 className="team-header__name">{team?.name}</h1>
            <div className="team-header__meta">
              <span className="team-header__privacy">
                <LockIcon size={14} /> Private group
              </span>
              <span className="team-header__dot">·</span>
              <span className="team-header__count">{members.length} members</span>
            </div>

            <div className="team-header__avatars">
              {displayMembers.map((member, idx) => {
                const memberUser = member.user || member;
                return (
                  <div
                    key={member.id || memberUser.id}
                    className="team-header__avatar"
                    style={{
                      backgroundColor: getColorFromString(memberUser.display_name || memberUser.email),
                      zIndex: displayMembers.length - idx
                    }}
                    title={memberUser.display_name || memberUser.email}
                  >
                    {(memberUser.profile_photo_url || memberUser.photo_url || memberUser.avatar) ? (
                      <img src={memberUser.profile_photo_url || memberUser.photo_url || memberUser.avatar} alt={memberUser.display_name} />
                    ) : (
                      getInitials(memberUser.display_name || memberUser.email)
                    )}
                  </div>
                );
              })}
              {remainingCount > 0 && (
                <div className="team-header__avatar team-header__avatar--more">
                  +{remainingCount}
                </div>
              )}
            </div>
          </div>

          <div className="team-header__actions">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<UserPlusIcon size={16} />}
              onClick={() => setShowInviteModal(true)}
            >
              Invite
            </Button>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={<ShareIcon size={16} />}
              onClick={() => setShowShareModal(true)}
            >
              Share
            </Button>

            <div className="joined-dropdown">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<CheckCircleIcon size={16} />}
                rightIcon={<ChevronDownIcon size={16} />}
                onClick={() => setShowJoinedDropdown(!showJoinedDropdown)}
              >
                Joined
              </Button>

              {showJoinedDropdown && (
                <div className="joined-dropdown__menu">
                  <button className="joined-dropdown__item" onClick={() => toast.info('Notifications settings coming soon')}>
                    <BellIcon size={16} />
                    Manage Notifications
                  </button>
                  <button className="joined-dropdown__item joined-dropdown__item--danger" onClick={handleLeaveTeam}>
                    <LogOutIcon size={16} />
                    Leave Team
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="team-tabs">
        <button
          className={`team-tabs__tab ${activeTab === 'posts' ? 'team-tabs__tab--active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button
          className={`team-tabs__tab ${activeTab === 'members' ? 'team-tabs__tab--active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
        <button
          className={`team-tabs__tab ${activeTab === 'about' ? 'team-tabs__tab--active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
        <button
          className={`team-tabs__tab ${activeTab === 'media' ? 'team-tabs__tab--active' : ''}`}
          onClick={() => setActiveTab('media')}
        >
          Media
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="team-content">
        {activeTab === 'posts' && (
          <PostsTab
            user={user}
            team={team}
            teamId={teamId}
            recordings={recordings}
            userLookup={userLookup}
            teamActivities={teamActivities}
            onLike={handleLike}
            onAffirm={handleAffirm}
          />
        )}

        {activeTab === 'members' && (
          <MembersTab
            members={members}
            isLeader={isLeader}
            onInvite={() => setShowInviteModal(true)}
          />
        )}

        {activeTab === 'about' && (
          <AboutTab team={team} />
        )}

        {activeTab === 'media' && (
          <MediaTab
            recordings={recordings}
            userLookup={userLookup}
          />
        )}
      </div>

      {/* Modals */}
      <AddMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        teamId={teamId}
        existingTeam={team}
        inviteOnly={true}
        onInviteMember={async (data) => {
          await teamsService.inviteMember(teamId, data);
          fetchTeamData();
        }}
      />

      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          teamName={team?.name}
          teamId={teamId}
        />
      )}
    </div>
  );
}

export default CareTeamPage;
