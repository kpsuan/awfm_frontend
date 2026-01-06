import React from 'react';
import { Button } from '../../components/common/Button';
import { UserPlusIcon } from '../../components/common/Icons';
import { getInitials, getColorFromString } from '../../utils/formatters';

const MembersTab = ({ members, isLeader, onInvite }) => {
  return (
    <div className="members-tab">
      <div className="members-tab__header">
        <h2>Members · {members.length}</h2>
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
      <div className="members-tab__grid">
        {members.map(member => {
          const memberUser = member.user || member;
          return (
            <div key={member.id || memberUser.id} className="member-card">
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
        })}
      </div>
    </div>
  );
};

export default MembersTab;
