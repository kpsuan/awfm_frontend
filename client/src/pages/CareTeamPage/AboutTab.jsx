import React from 'react';
import { LockIcon, EyeIcon, MapPinIcon, TrashIcon } from '../../components/common/Icons';
import { Button } from '../../components/common/Button';

const AboutTab = ({ team, isLeader, onDeleteTeam }) => {
  return (
    <div className="about-tab">
      <div className="about-tab__card">
        <h2>About this group</h2>
        {team?.description ? (
          <p className="about-tab__description">{team.description}</p>
        ) : (
          <p className="about-tab__description about-tab__description--empty">
            No description available.
          </p>
        )}

        <div className="about-tab__details">
          <div className="about-tab__detail">
            <LockIcon size={20} />
            <div>
              <strong>Private</strong>
              <p>Only members can see who's in the group and what they post.</p>
            </div>
          </div>
          <div className="about-tab__detail">
            <EyeIcon size={20} />
            <div>
              <strong>Visible</strong>
              <p>Anyone can find this group.</p>
            </div>
          </div>
          <div className="about-tab__detail">
            <MapPinIcon size={20} />
            <div>
              <strong>General</strong>
              <p>Care Team</p>
            </div>
          </div>
        </div>
      </div>

      {isLeader && (
        <div className="about-tab__card about-tab__danger-zone">
          <h2>Danger Zone</h2>
          <p className="about-tab__description">
            Deleting the care team will permanently remove all data, recordings, and member connections.
          </p>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<TrashIcon size={16} />}
            onClick={onDeleteTeam}
          >
            Delete Care Team
          </Button>
        </div>
      )}
    </div>
  );
};

export default AboutTab;
