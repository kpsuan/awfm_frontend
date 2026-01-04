import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import Modal from './Modal';
import { teamsService } from '../../../services/teams';
import './AddMemberModal.css';

// Team icon for header
const TeamIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="10" r="4" fill="#B432A3"/>
    <circle cx="8" cy="12" r="3" fill="#5C40FB"/>
    <circle cx="24" cy="12" r="3" fill="#5C40FB"/>
    <path d="M16 16C12 16 9 19 9 22V24H23V22C23 19 20 16 16 16Z" fill="#B432A3"/>
    <path d="M8 17C5.5 17 4 19 4 21V23H9V21C9 19.5 9.5 18 10.5 17H8Z" fill="#5C40FB"/>
    <path d="M24 17H21.5C22.5 18 23 19.5 23 21V23H28V21C28 19 26.5 17 24 17Z" fill="#5C40FB"/>
  </svg>
);

// Edit icon
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Default invite message
const DEFAULT_MESSAGE = "I'm reaching out to ask you to join my advance care team so we can teamwork and see through our advance care plans together, interdependently, as A Whole Family Matter. Thank you!";

const AddMemberModal = ({
  isOpen,
  onClose,
  onAddMember,
  onInviteMember,
  onCreateTeam,
  onRemind,
  onRevoke,
  teamId = null,
  existingTeam = null,
  userName = "Norman",
  userAvatar = "https://i.pravatar.cc/82?img=12"
}) => {
  // If existing team, skip to invite tab
  const initialTab = existingTeam ? 'invite' : 'team';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [emails, setEmails] = useState('');
  const [role, setRole] = useState('member');
  const [selectedInvites, setSelectedInvites] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Team creation fields
  const [teamName, setTeamName] = useState(existingTeam?.name || '');
  const [teamDescription, setTeamDescription] = useState(existingTeam?.description || '');
  const [teamLevel, setTeamLevel] = useState(existingTeam?.team_level || '');
  const [teamCreated, setTeamCreated] = useState(!!existingTeam);
  const [createdTeamId, setCreatedTeamId] = useState(null);

  // Editable invite message
  const [inviteMessage, setInviteMessage] = useState(DEFAULT_MESSAGE);
  const [isEditingMessage, setIsEditingMessage] = useState(false);

  // Sent invites state - fetched from API
  const [sentInvites, setSentInvites] = useState([]);
  const [isLoadingInvites, setIsLoadingInvites] = useState(false);

  // Get the active team ID (existing or newly created)
  const activeTeamId = teamId || existingTeam?.id || createdTeamId;

  // Fetch sent invitations for the team
  const fetchSentInvites = useCallback(async () => {
    if (!activeTeamId) return;

    setIsLoadingInvites(true);
    try {
      const response = await teamsService.getTeamMembers(activeTeamId);
      // Filter for pending invitations and active members (excluding leader)
      const members = response.data || response || [];
      const invitations = members
        .filter(m => m.status === 'pending' || m.status === 'active')
        .filter(m => m.role !== 'leader') // Exclude the leader
        .map(m => ({
          id: m.id,
          email: m.email,
          display_name: m.display_name,
          role: m.role,
          status: m.status === 'active' ? 'joined' : 'sent',
          is_pending_signup: m.is_pending_signup || false, // Track non-registered users
          date: formatDate(m.created_at)
        }));
      setSentInvites(invitations);
    } catch (error) {
      console.error('Error fetching sent invites:', error);
      setSentInvites([]);
    } finally {
      setIsLoadingInvites(false);
    }
  }, [activeTeamId]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const day = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const dayNum = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    return `${time} ${day} ${dayNum} ${month} ${year}`;
  };

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(existingTeam ? 'invite' : 'team');
      setTeamCreated(!!existingTeam);
      if (existingTeam) {
        setTeamName(existingTeam.name || '');
        setTeamDescription(existingTeam.description || '');
        setTeamLevel(existingTeam.team_level || '');
      }
    }
  }, [isOpen, existingTeam]);

  // Fetch invites when switching to sent tab or when team changes
  useEffect(() => {
    if (isOpen && activeTab === 'sent' && activeTeamId) {
      fetchSentInvites();
    }
  }, [isOpen, activeTab, activeTeamId, fetchSentInvites]);

  const displayInvites = sentInvites;

  // Calculate stats
  const stats = {
    sent: displayInvites.length,
    opened: displayInvites.filter(i => i.status === 'opened' || i.status === 'joined').length,
    joined: displayInvites.filter(i => i.status === 'joined').length
  };

  // Handle team creation
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    setIsSubmitting(true);
    try {
      if (onCreateTeam) {
        const result = await onCreateTeam({
          name: teamName.trim(),
          description: teamDescription.trim(),
          team_level: teamLevel || null
        });
        // Store the created team ID for fetching invites later
        if (result?.team?.id) {
          setCreatedTeamId(result.team.id);
        }
      }
      setTeamCreated(true);
      setActiveTab('invite');
      toast.success(`Care team "${teamName.trim()}" created successfully!`);
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error(error.message || 'Failed to create care team. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle team update (for existing teams)
  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    if (!teamName.trim() || !existingTeam) return;

    setIsSubmitting(true);
    try {
      await teamsService.updateTeam(existingTeam.id, {
        name: teamName.trim(),
        description: teamDescription.trim(),
        team_level: teamLevel || null
      });
      toast.success('Team updated successfully!');
      setActiveTab('invite');
    } catch (error) {
      console.error('Error updating team:', error);
      toast.error(error.message || 'Failed to update team. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle team form submit (create or update)
  const handleTeamSubmit = existingTeam ? handleUpdateTeam : handleCreateTeam;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emails.trim()) return;

    setIsSubmitting(true);
    try {
      // Parse multiple emails (comma or newline separated)
      const emailList = emails.split(/[,\n]/).map(e => e.trim()).filter(e => e);
      let successCount = 0;

      for (const email of emailList) {
        try {
          if (onInviteMember) {
            await onInviteMember({ email, role, message: inviteMessage });
            successCount++;
          } else if (onAddMember) {
            await onAddMember({ email, role, message: inviteMessage });
            successCount++;
          }
        } catch (inviteError) {
          console.error(`Error inviting ${email}:`, inviteError);
          toast.error(`Failed to invite ${email}`);
        }
      }

      // Show success toast
      if (successCount > 0) {
        const message = successCount === 1
          ? 'Invitation sent successfully!'
          : `${successCount} invitations sent successfully!`;
        toast.success(message);
      }

      // Reset form
      setEmails('');
      setRole('member');
      // Refresh the invites list and switch to sent tab
      await fetchSentInvites();
      setActiveTab('sent');
    } catch (error) {
      console.error('Error sending invites:', error);
      toast.error('Failed to send invitations. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmails('');
    setRole('member');
    setActiveTab(existingTeam ? 'invite' : 'team');
    setSelectedInvites([]);
    setIsEditingMessage(false);
    setInviteMessage(DEFAULT_MESSAGE);
    setSentInvites([]);
    if (!existingTeam) {
      setTeamName('');
      setTeamDescription('');
      setTeamLevel('');
      setTeamCreated(false);
      setCreatedTeamId(null);
    }
    onClose();
  };

  const toggleInviteSelection = (inviteId) => {
    setSelectedInvites(prev =>
      prev.includes(inviteId)
        ? prev.filter(id => id !== inviteId)
        : [...prev, inviteId]
    );
  };

  const handleRemind = () => {
    if (onRemind && selectedInvites.length > 0) {
      onRemind(selectedInvites);
    }
  };

  const handleRevoke = () => {
    if (onRevoke && selectedInvites.length > 0) {
      onRevoke(selectedInvites);
    }
  };

  const getStatusLabel = (status, isPendingSignup) => {
    if (isPendingSignup) return 'AWAITING SIGNUP';
    switch (status) {
      case 'joined': return 'JOINED';
      case 'opened': return 'OPENED';
      case 'sent': return 'SENT';
      default: return 'PENDING';
    }
  };

  const getStatusClass = (status, isPendingSignup) => {
    if (isPendingSignup) return 'add-member-modal__invite-status--pending-signup';
    switch (status) {
      case 'joined': return 'add-member-modal__invite-status--joined';
      case 'opened': return 'add-member-modal__invite-status--opened';
      default: return 'add-member-modal__invite-status--sent';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} showCloseButton={false} size="medium">
      <div className="add-member-modal">
        {/* Header */}
        <div className="add-member-modal__header">
          <TeamIcon />
          <h2 className="add-member-modal__title">
            {existingTeam
              ? existingTeam.name
              : (teamCreated ? 'Invite to Care Team' : 'Create your Care Team')
            }
          </h2>
        </div>

        {/* Tabs */}
        <div className="add-member-modal__tabs">
          <button
            type="button"
            className={`add-member-modal__tab ${activeTab === 'team' ? 'add-member-modal__tab--active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            {existingTeam ? 'Edit Team' : 'Team Info'}
          </button>
          <button
            type="button"
            className={`add-member-modal__tab ${activeTab === 'invite' ? 'add-member-modal__tab--active' : ''}`}
            onClick={() => setActiveTab('invite')}
            disabled={!teamCreated && !existingTeam}
          >
            Invite Members
          </button>
          <button
            type="button"
            className={`add-member-modal__tab ${activeTab === 'sent' ? 'add-member-modal__tab--active' : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            Sent Invites
          </button>
        </div>

        {/* Team Info Tab */}
        {activeTab === 'team' && (
          <form onSubmit={handleTeamSubmit} className="add-member-modal__invite-form">
            {/* Team Name */}
            <div className="add-member-modal__field">
              <label htmlFor="team-name" className="add-member-modal__label">
                Team Name <span className="add-member-modal__required">*</span>
              </label>
              <input
                id="team-name"
                type="text"
                className="add-member-modal__input"
                placeholder="e.g., My Family Care Team"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>

            {/* Team Description */}
            <div className="add-member-modal__field">
              <label htmlFor="team-description" className="add-member-modal__label">
                Description <span className="add-member-modal__optional">(optional)</span>
              </label>
              <textarea
                id="team-description"
                className="add-member-modal__textarea"
                placeholder="Describe your care team's purpose..."
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Team Level */}
            <div className="add-member-modal__field">
              <label htmlFor="team-level" className="add-member-modal__label">
                Team Level <span className="add-member-modal__optional">(optional)</span>
              </label>
              <select
                id="team-level"
                className="add-member-modal__select"
                value={teamLevel}
                onChange={(e) => setTeamLevel(e.target.value)}
              >
                <option value="">Select a level...</option>
                <option value="1">Level 1: Immediate Family</option>
                <option value="2">Level 2: Family Back Home</option>
                <option value="3">Level 3: Local Chosen Family</option>
              </select>
              <p className="add-member-modal__hint">
                Different levels help organize multiple care teams for different contexts.
              </p>
            </div>

            {/* Actions */}
            <div className="add-member-modal__actions">
              <button
                type="submit"
                className="add-member-modal__btn add-member-modal__btn--primary"
                disabled={isSubmitting || !teamName.trim()}
              >
                {isSubmitting
                  ? (existingTeam ? 'Saving...' : 'Creating...')
                  : (existingTeam ? 'Save Changes' : 'Create Team & Continue')
                }
                <span className="add-member-modal__btn-arrow">→</span>
              </button>
              <button
                type="button"
                className="add-member-modal__btn add-member-modal__btn--secondary"
                onClick={handleClose}
              >
                Cancel
                <span className="add-member-modal__btn-arrow">←</span>
              </button>
            </div>
          </form>
        )}

        {/* Invite Tab Content */}
        {activeTab === 'invite' && (
          <form onSubmit={handleSubmit} className="add-member-modal__invite-form">
            {/* Email Input */}
            <div className="add-member-modal__field">
              <label htmlFor="invite-emails" className="add-member-modal__label">
                Email Addresses
              </label>
              <input
                id="invite-emails"
                type="text"
                className="add-member-modal__email-input"
                placeholder="Add multiple email addresses (comma separated)..."
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
              />
            </div>

            {/* Role Selection */}
            <div className="add-member-modal__field">
              <label htmlFor="member-role" className="add-member-modal__label">
                Role
              </label>
              <select
                id="member-role"
                className="add-member-modal__select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="member">Team Member</option>
                <option value="witness">Witness (cannot be guardian/emergency contact)</option>
              </select>
              <p className="add-member-modal__hint">
                {role === 'witness'
                  ? 'Witnesses can observe but cannot be designated as your guardian or emergency contact.'
                  : 'Team members can be designated as guardians or emergency contacts.'}
              </p>
            </div>

            <p className="add-member-modal__limit-text">
              Maximum 5 members for optimal decision-making and collaboration.
            </p>

            {/* Editable Message */}
            <div className="add-member-modal__message-preview">
              <div className="add-member-modal__message-header">
                <img
                  src={userAvatar}
                  alt={userName}
                  className="add-member-modal__message-avatar"
                />
                <span className="add-member-modal__message-greeting">Hello there!</span>
                <button
                  type="button"
                  className="add-member-modal__edit-btn"
                  onClick={() => setIsEditingMessage(!isEditingMessage)}
                  title={isEditingMessage ? 'Done editing' : 'Edit message'}
                >
                  <EditIcon />
                  <span>{isEditingMessage ? 'Done' : 'Edit'}</span>
                </button>
              </div>
              {isEditingMessage ? (
                <textarea
                  className="add-member-modal__message-textarea"
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  rows={4}
                  placeholder="Write your personalized message..."
                />
              ) : (
                <p className="add-member-modal__message-text">{inviteMessage}</p>
              )}
              {isEditingMessage && (
                <button
                  type="button"
                  className="add-member-modal__reset-btn"
                  onClick={() => setInviteMessage(DEFAULT_MESSAGE)}
                >
                  Reset to default
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="add-member-modal__actions">
              <button
                type="submit"
                className="add-member-modal__btn add-member-modal__btn--primary"
                disabled={isSubmitting || !emails.trim()}
              >
                {isSubmitting ? 'Sending...' : 'Send Invites'}
                <span className="add-member-modal__btn-arrow">→</span>
              </button>
              <button
                type="button"
                className="add-member-modal__btn add-member-modal__btn--secondary"
                onClick={handleClose}
              >
                Exit
                <span className="add-member-modal__btn-arrow">←</span>
              </button>
            </div>
          </form>
        )}

        {/* Sent Invites Tab Content */}
        {activeTab === 'sent' && (
          <div className="add-member-modal__sent-content">
            {isLoadingInvites ? (
              <div className="add-member-modal__loading">
                <p>Loading invitations...</p>
              </div>
            ) : !activeTeamId ? (
              <div className="add-member-modal__empty">
                <p>Create a team first to see sent invitations.</p>
              </div>
            ) : displayInvites.length === 0 ? (
              <div className="add-member-modal__empty">
                <p>No invitations sent yet.</p>
                <p className="add-member-modal__hint">Go to the "Invite Members" tab to send invitations.</p>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="add-member-modal__stats">
                  <div className="add-member-modal__stat">
                    <span className="add-member-modal__stat-number">{stats.sent}</span>
                    <span className="add-member-modal__stat-label">Sent</span>
                  </div>
                  <div className="add-member-modal__stat">
                    <span className="add-member-modal__stat-number">{stats.opened}</span>
                    <span className="add-member-modal__stat-label">Opened</span>
                  </div>
                  <div className="add-member-modal__stat">
                    <span className="add-member-modal__stat-number">{stats.joined}</span>
                    <span className="add-member-modal__stat-label">Joined</span>
                  </div>
                </div>

                {/* Invite List */}
                <div className="add-member-modal__invite-list">
                  {displayInvites.map((invite) => (
                    <div
                      key={invite.id}
                      className={`add-member-modal__invite-item ${selectedInvites.includes(invite.id) ? 'add-member-modal__invite-item--selected' : ''}`}
                      onClick={() => toggleInviteSelection(invite.id)}
                    >
                      <div className="add-member-modal__invite-checkbox">
                        <div className={`add-member-modal__checkbox ${selectedInvites.includes(invite.id) ? 'add-member-modal__checkbox--checked' : ''}`}>
                          {selectedInvites.includes(invite.id) && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="add-member-modal__invite-details">
                        <span className="add-member-modal__invite-email">
                          {invite.display_name || invite.email}
                          {invite.role === 'witness' && <span className="add-member-modal__role-badge">Witness</span>}
                        </span>
                        <span className={`add-member-modal__invite-status ${getStatusClass(invite.status, invite.is_pending_signup)}`}>
                          {getStatusLabel(invite.status, invite.is_pending_signup)} {invite.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="add-member-modal__actions">
                  <button
                    type="button"
                    className="add-member-modal__btn add-member-modal__btn--primary"
                    onClick={handleRemind}
                    disabled={selectedInvites.length === 0}
                  >
                    Remind
                  </button>
                  <button
                    type="button"
                    className="add-member-modal__btn add-member-modal__btn--secondary"
                    onClick={handleRevoke}
                    disabled={selectedInvites.length === 0}
                  >
                    Revoke
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddMemberModal;
