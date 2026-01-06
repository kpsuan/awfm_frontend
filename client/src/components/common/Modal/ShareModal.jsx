import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Modal from './Modal';
import { LinkIcon, MailIcon, CopyIcon, CheckIcon } from '../Icons';
import './ShareModal.css';

const ShareModal = ({ isOpen, onClose, teamName, teamId }) => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');

  const teamUrl = `${window.location.origin}/team/${teamId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(teamUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleEmailInvite = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    const subject = encodeURIComponent(`Join ${teamName} on AWFM`);
    const body = encodeURIComponent(`You've been invited to join ${teamName}!\n\nClick here to join: ${teamUrl}`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
    setEmail('');
    toast.success('Opening email client...');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Team" size="small">
      <div className="share-modal">
        <p className="share-modal__subtitle">
          Share <strong>{teamName}</strong> with others
        </p>

        {/* Copy Link Section */}
        <div className="share-modal__section">
          <label className="share-modal__label">
            <LinkIcon size={16} />
            Team Link
          </label>
          <div className="share-modal__link-row">
            <input
              type="text"
              value={teamUrl}
              readOnly
              className="share-modal__link-input"
            />
            <button
              type="button"
              className={`share-modal__copy-btn ${copied ? 'share-modal__copy-btn--copied' : ''}`}
              onClick={handleCopyLink}
            >
              {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Email Invite Section */}
        <div className="share-modal__section">
          <label className="share-modal__label">
            <MailIcon size={16} />
            Invite via Email
          </label>
          <form className="share-modal__email-form" onSubmit={handleEmailInvite}>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="share-modal__email-input"
            />
            <button type="submit" className="share-modal__email-btn">
              Send Invite
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
