import React, { useState } from 'react';
import { useAuth } from '../context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DeleteAccountModal from '../components/common/Modal/DeleteAccountModal';
import ChangePasswordModal from '../components/common/Modal/ChangePasswordModal';
import api from '../services/api';
import './AccountSettings.css';

const AccountSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    displayName: user?.display_name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    pronouns: user?.pronouns || '',
    phoneNumber: user?.phone_number || '',
    birthDate: user?.birth_date || '',
    location: user?.location || '',
  });
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    // TODO: Implement API call to update user profile
    console.log('Saving profile:', formData);
  };

  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
  };

  const handlePasswordChangeAction = async (data) => {
    if (data.action === 'request_code') {
      // Request verification code
      try {
        // First verify the current password by attempting to request a code
        await api.post('/v1/auth/request-password-change-code/', {});
        return; // Success - code sent
      } catch (error) {
        throw new Error(error.message || 'Failed to send verification code');
      }
    } else if (data.action === 'change_password') {
      // Change password with verification code
      try {
        await api.post('/v1/auth/change-password/', {
          verification_code: data.verificationCode,
          old_password: data.currentPassword,
          new_password: data.newPassword,
          new_password2: data.confirmPassword,
        });

        // Close modal
        setShowChangePasswordModal(false);

        // Show success toast
        toast.success('Password changed successfully!');
      } catch (error) {
        throw new Error(error.message || 'Failed to change password');
      }
    }
  };

  const handleCancelPasswordChange = () => {
    setShowChangePasswordModal(false);
  };

  const handleDeleteUser = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async (password) => {
    try {
      await api.post('/v1/auth/delete-account/', { password });

      // Close modal
      setShowDeleteModal(false);

      // Logout user
      logout();

      // Redirect to home with success message
      navigate('/', { state: { message: 'Account deleted successfully. You have 30 days to restore your account.' } });
    } catch (error) {
      // Throw error to be handled by the modal
      throw new Error(error.message || 'Failed to delete account');
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };


  const formatLastLogin = (lastLogin) => {
    if (!lastLogin) return 'Never';
    const date = new Date(lastLogin);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="account-settings__loading">
        <p>Please log in to view account settings.</p>
      </div>
    );
  }

  return (
    <>
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onSuccess={handlePasswordChangeAction}
        onCancel={handleCancelPasswordChange}
      />

      <div className="account-settings">
        <div className="account-settings__container">
        {/* Two Column Layout */}
        <div className="account-settings__content">
          {/* Left Column - User Profile */}
          <div className="account-settings__left-column">
            {/* Profile Card */}
            <div className="account-settings__profile-card">
              <div className="account-settings__avatar">
                {user.profile_photo_url ? (
                  <img src={user.profile_photo_url} alt={user.display_name} />
                ) : (
                  <div className="account-settings__avatar-placeholder">
                    <span className="material-icons">person</span>
                  </div>
                )}
              </div>

              <h2 className="account-settings__user-email">{user.email}</h2>
              <p className="account-settings__last-sign-in">
                Last sign in {formatLastLogin(user.last_login_at)}
              </p>

            </div>

            {/* Action Buttons */}
            <div className="account-settings__actions-list">
              <button
                className="account-settings__action-btn"
                onClick={handleChangePassword}
              >
                <span className="material-icons">lock</span>
                <span>Change Password</span>
              </button>

              <button
                className="account-settings__action-btn account-settings__action-btn--danger"
                onClick={handleDeleteUser}
              >
                <span className="material-icons">delete_forever</span>
                <span>Delete User</span>
              </button>
            </div>
          </div>

          {/* Right Column - Personal Information */}
          <div className="account-settings__right-column">
            <h2 className="account-settings__section-title">Personal Information</h2>

            <div className="account-settings__form">
              <div className="account-settings__form-row">
                <div className="account-settings__form-field">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Cameron"
                  />
                </div>

                <div className="account-settings__form-field">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Williamson"
                  />
                </div>
              </div>

              <div className="account-settings__form-field">
                <label htmlFor="email">
                  Email Address
                  {user.email_verified && (
                    <span className="account-settings__verified-badge">Verified</span>
                  )}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={user.email}
                />
              </div>

              <div className="account-settings__form-field">
                <label htmlFor="displayName">Display Name</label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Enter your display name"
                />
              </div>

              <div className="account-settings__form-field">
                <label htmlFor="pronouns">Pronouns</label>
                <input
                  id="pronouns"
                  name="pronouns"
                  type="text"
                  value={formData.pronouns}
                  onChange={handleChange}
                  placeholder="e.g., she/her, he/him, they/them"
                />
              </div>

              <div className="account-settings__form-row">
                <div className="account-settings__form-field">
                  <label htmlFor="phoneNumber">Phone Number (Optional)</label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="account-settings__form-field">
                  <label htmlFor="birthDate">Birth Date (Optional)</label>
                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="account-settings__form-field">
                <label htmlFor="location">Location (Optional)</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., San Francisco, CA"
                />
              </div>

              <div className="account-settings__form-field">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us a little about yourself"
                  rows="4"
                />
              </div>

              <button
                className="account-settings__save-btn"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default AccountSettings;
