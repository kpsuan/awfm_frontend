import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import { ContentHeader } from '../components/common/Navigation';
import Button from '../components/common/Button/Button';
import './ProfilePage.css';

// Helper to get initials from name
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Format date for display
const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

// Format relative time
const formatRelativeTime = (dateStr) => {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="profile-page">
        <ContentHeader />
        <div className="profile-page__loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <ContentHeader />
        <div className="profile-page__empty">
          <span className="material-icons">person_off</span>
          <h2>Not logged in</h2>
          <p>Please log in to view your profile.</p>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Log In
          </Button>
        </div>
      </div>
    );
  }

  const displayName = user.display_name || user.email?.split('@')[0] || 'User';
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
  const memberSince = formatDate(user.created_at);
  const lastActive = formatRelativeTime(user.last_login_at);

  return (
    <div className="profile-page">
      <ContentHeader />

      <div className="profile-page__container">
        {/* Profile Header Card */}
        <div className="profile-header">
          <div className="profile-header__content">
            <div className="profile-header__avatar-section">
              <div className="profile-header__avatar">
                {user.profile_photo_url ? (
                  <img src={user.profile_photo_url} alt={displayName} />
                ) : (
                  <span className="profile-header__avatar-initials">
                    {getInitials(displayName)}
                  </span>
                )}
              </div>

              <div className="profile-header__status">
                <span className="profile-header__status-dot"></span>
                <span>Active</span>
              </div>
            </div>

            <div className="profile-header__info">
              <div className="profile-header__name-row">
                <h1 className="profile-header__display-name">{displayName}</h1>
                {user.email_verified && (
                  <span className="profile-header__verified" title="Verified">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L13.09 8.26L19 6L14.74 10.91L21 12L14.74 13.09L19 18L13.09 15.74L12 22L10.91 15.74L5 18L9.26 13.09L3 12L9.26 10.91L5 6L10.91 8.26L12 2Z"/>
                    </svg>
                  </span>
                )}
              </div>

              {fullName && (
                <p className="profile-header__full-name">{fullName}</p>
              )}

              <p className="profile-header__email">{user.email}</p>

              {user.pronouns && (
                <span className="profile-header__pronouns">{user.pronouns}</span>
              )}
            </div>

            <div className="profile-header__actions">
              <Button
                variant="primary"
                onClick={() => navigate('/account-settings')}
                leftIcon={<span className="material-icons">edit</span>}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="profile-page__grid">
          {/* Left Column */}
          <div className="profile-page__main">
            {/* About Section */}
            <section className="profile-section">
              <h2 className="profile-section__title">
                <span className="material-icons">info</span>
                About
              </h2>

              <div className="profile-section__content">
                {user.bio ? (
                  <p className="profile-about__bio">{user.bio}</p>
                ) : (
                  <p className="profile-about__bio profile-about__bio--empty">
                    No bio added yet. Share a little about yourself!
                  </p>
                )}
              </div>
            </section>

            {/* Details Section */}
            <section className="profile-section">
              <h2 className="profile-section__title">
                <span className="material-icons">badge</span>
                Details
              </h2>

              <div className="profile-details">
                {user.location && (
                  <div className="profile-detail">
                    <span className="material-icons profile-detail__icon">location_on</span>
                    <div className="profile-detail__content">
                      <span className="profile-detail__label">Location</span>
                      <span className="profile-detail__value">{user.location}</span>
                    </div>
                  </div>
                )}

                {user.phone_number && (
                  <div className="profile-detail">
                    <span className="material-icons profile-detail__icon">phone</span>
                    <div className="profile-detail__content">
                      <span className="profile-detail__label">Phone</span>
                      <span className="profile-detail__value">{user.phone_number}</span>
                    </div>
                  </div>
                )}

                {user.birth_date && (
                  <div className="profile-detail">
                    <span className="material-icons profile-detail__icon">cake</span>
                    <div className="profile-detail__content">
                      <span className="profile-detail__label">Birthday</span>
                      <span className="profile-detail__value">{formatDate(user.birth_date)}</span>
                    </div>
                  </div>
                )}

                <div className="profile-detail">
                  <span className="material-icons profile-detail__icon">calendar_today</span>
                  <div className="profile-detail__content">
                    <span className="profile-detail__label">Member since</span>
                    <span className="profile-detail__value">{memberSince || 'Unknown'}</span>
                  </div>
                </div>

                <div className="profile-detail">
                  <span className="material-icons profile-detail__icon">schedule</span>
                  <div className="profile-detail__content">
                    <span className="profile-detail__label">Last active</span>
                    <span className="profile-detail__value">{lastActive}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Stats & Badges */}
          <div className="profile-page__sidebar">
            {/* Account Status Card */}
            <div className="profile-card">
              <h3 className="profile-card__title">Account Status</h3>

              <div className="profile-stats">
                <div className="profile-stat">
                  <div className={`profile-stat__badge ${user.email_verified ? 'profile-stat__badge--verified' : 'profile-stat__badge--pending'}`}>
                    <span className="material-icons">
                      {user.email_verified ? 'verified' : 'pending'}
                    </span>
                  </div>
                  <div className="profile-stat__info">
                    <span className="profile-stat__label">Email</span>
                    <span className="profile-stat__value">
                      {user.email_verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="profile-stat">
                  <div className={`profile-stat__badge ${user.is_hcw ? 'profile-stat__badge--hcw' : 'profile-stat__badge--default'}`}>
                    <span className="material-icons">
                      {user.is_hcw ? 'medical_services' : 'person'}
                    </span>
                  </div>
                  <div className="profile-stat__info">
                    <span className="profile-stat__label">Account Type</span>
                    <span className="profile-stat__value">
                      {user.is_hcw ? 'Healthcare Worker' : 'Standard User'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="profile-card">
              <h3 className="profile-card__title">Quick Actions</h3>

              <div className="profile-actions">
                <button
                  className="profile-action"
                  onClick={() => navigate('/account-settings')}
                >
                  <span className="material-icons">settings</span>
                  <span>Account Settings</span>
                  <span className="material-icons profile-action__arrow">chevron_right</span>
                </button>

                <button
                  className="profile-action"
                  onClick={() => navigate('/dashboard')}
                >
                  <span className="material-icons">dashboard</span>
                  <span>Dashboard</span>
                  <span className="material-icons profile-action__arrow">chevron_right</span>
                </button>

                <button
                  className="profile-action"
                  onClick={() => navigate('/questionnaire')}
                >
                  <span className="material-icons">quiz</span>
                  <span>Continue Questionnaire</span>
                  <span className="material-icons profile-action__arrow">chevron_right</span>
                </button>
              </div>
            </div>

            {/* HCW Badge (if applicable) */}
            {user.is_hcw && user.hcw_attested_at && (
              <div className="profile-card profile-card--hcw">
                <div className="hcw-badge">
                  <div className="hcw-badge__icon">
                    <span className="material-icons">verified_user</span>
                  </div>
                  <div className="hcw-badge__content">
                    <h4>Healthcare Worker</h4>
                    <p>Attested on {formatDate(user.hcw_attested_at)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
