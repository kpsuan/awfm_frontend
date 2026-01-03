import api from './api';

export const teamsService = {
  // List user's teams
  getTeams: async () => {
    const response = await api.get('/v1/teams/');
    return response;
  },

  // Get single team
  getTeam: async (teamId) => {
    const response = await api.get(`/v1/teams/${teamId}/`);
    return response;
  },

  // Create a new team
  createTeam: async (name, description = '', teamLevel = null) => {
    const response = await api.post('/v1/teams/', {
      name,
      description,
      team_level: teamLevel,
    });
    return response;
  },

  // Update team
  updateTeam: async (teamId, data) => {
    const response = await api.patch(`/v1/teams/${teamId}/`, data);
    return response;
  },

  // Delete team (soft delete)
  deleteTeam: async (teamId) => {
    const response = await api.delete(`/v1/teams/${teamId}/`);
    return response;
  },

  // Get team members
  getTeamMembers: async (teamId) => {
    const response = await api.get(`/v1/teams/${teamId}/members/`);
    return response;
  },

  // Invite member to team
  inviteMember: async (teamId, email, role = 'member') => {
    const response = await api.post(`/v1/teams/${teamId}/invite/`, {
      email,
      role,
    });
    return response;
  },

  // Get pending invitations for current user
  getPendingInvitations: async () => {
    const response = await api.get('/v1/teams/invitations/');
    return response;
  },

  // Accept invitation
  acceptInvitation: async (token) => {
    const response = await api.post('/v1/teams/accept-invitation/', { token });
    return response;
  },

  // Decline invitation
  declineInvitation: async (token) => {
    const response = await api.post('/v1/teams/decline-invitation/', { token });
    return response;
  },

  // Leave team
  leaveTeam: async (teamId) => {
    const response = await api.post(`/v1/teams/${teamId}/leave/`);
    return response;
  },

  // Remove member from team (leader only)
  removeMember: async (teamId, userId) => {
    const response = await api.post(`/v1/teams/${teamId}/remove-member/`, {
      user_id: userId,
    });
    return response;
  },

  // Update membership (leader only)
  updateMembership: async (teamId, membershipId, data) => {
    const response = await api.patch(
      `/v1/teams/${teamId}/members/${membershipId}/`,
      data
    );
    return response;
  },

  // Transfer leadership (leader only)
  transferLeadership: async (teamId, newLeaderUserId) => {
    const response = await api.post(`/v1/teams/${teamId}/transfer-leadership/`, {
      user_id: newLeaderUserId,
    });
    return response;
  },

  // Validate a pending invitation token (for signup page, public endpoint)
  validatePendingInvitation: async (token) => {
    const response = await api.get(`/v1/teams/validate-invitation/?token=${token}`);
    return response;
  },

  // Claim a pending invitation after signup
  claimPendingInvitation: async (token) => {
    const response = await api.post('/v1/teams/claim-invitation/', { token });
    return response;
  },
};
