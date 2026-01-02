import React from 'react';
import './Avatar.css';

// Default user icon SVG for non-logged in users
const DefaultUserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="avatar__default-icon">
    <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.3"/>
    <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
  </svg>
);

const UserAvatar = ({
  name,
  imageUrl,
  size = 'md',
  color
}) => {
  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: 'avatar--sm',
    md: 'avatar--md',
    lg: 'avatar--lg'
  };

  const showDefault = !name && !imageUrl;

  return (
    <div
      className={`avatar ${sizeClasses[size]} ${showDefault ? 'avatar--default' : ''}`}
      style={{ backgroundColor: showDefault ? 'var(--color-gray-200)' : (color || 'var(--color-primary)') }}
      title={name || 'User'}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="avatar__image" />
      ) : showDefault ? (
        <DefaultUserIcon />
      ) : (
        <span className="avatar__initials">{initials}</span>
      )}
    </div>
  );
};

export default UserAvatar;
