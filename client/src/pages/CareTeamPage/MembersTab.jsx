import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { UserPlusIcon } from '../../components/common/Icons';
import { getInitials, getColorFromString } from '../../utils/formatters';

const MemberCard = ({ member }) => {
  const memberUser = member.user || member;
  const isPending = member.status === 'pending';

  return (
    <div className={`member-card ${isPending ? 'member-card--pending' : ''}`}>
      <div
        className="member-card__avatar"
        style={{ backgroundColor: getColorFromString(memberUser.display_name || memberUser.email) }}
      >
        {(memberUser.profile_photo_url || memberUser.photo_url || memberUser.avatar) ? (
          <img src={memberUser.profile_photo_url || memberUser.photo_url || memberUser.avatar} alt={memberUser.display_name} />
        ) : (
          getInitials(memberUser.display_name || memberUser.email)
        )}
      </div>
      <div className="member-card__info">
        <span className="member-card__name">
          {memberUser.display_name || memberUser.email}
        </span>
        <span className="member-card__role">
          {member.role === 'leader' && 'Leader'}
          {member.role === 'witness' && 'Witness'}
          {member.role === 'member' && 'Member'}
        </span>
      </div>
      {member.is_hcw && (
        <span className="member-card__badge">HCW</span>
      )}
    </div>
  );
};

const MembersTab = ({ members, isLeader, onInvite }) => {
  const [activeSubTab, setActiveSubTab] = useState('members');

  const activeMembers = members.filter(m => m.status === 'active');
  const pendingMembers = members.filter(m => m.status === 'pending');

  const displayedMembers = activeSubTab === 'members' ? activeMembers : pendingMembers;

  return (
    <div className="members-tab">
      <div className="members-tab__header">
        <div className="members-tab__subtabs">
          <button
            className={`members-tab__subtab ${activeSubTab === 'members' ? 'members-tab__subtab--active' : ''}`}
            onClick={() => setActiveSubTab('members')}
          >
            Members ({activeMembers.length})
          </button>
          <button
            className={`members-tab__subtab ${activeSubTab === 'pending' ? 'members-tab__subtab--active' : ''}`}
            onClick={() => setActiveSubTab('pending')}
          >
            Pending Invites ({pendingMembers.length})
          </button>
        </div>
        {isLeader && (
          <Button
            variant="primary"
            size="sm"
            leftIcon={<UserPlusIcon size={16} />}
            onClick={onInvite}
          >
            Invite Members
          </Button>
        )}
      </div>

      {displayedMembers.length > 0 ? (
        <div className="members-tab__grid">
          {displayedMembers.map(member => (
            <MemberCard key={member.id || member.user?.id} member={member} />
          ))}
        </div>
      ) : (
        <div className="members-tab__empty">
          {activeSubTab === 'members'
            ? 'No active members yet.'
            : 'No pending invitations.'}
        </div>
      )}
    </div>
  );
};

export default MembersTab;
