import React from 'react';
import './Avatar.css';

// Default user icon SVG for non-logged in users
const DefaultUserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="avatar__default-icon">
    <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.3"/>
    <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
  </svg>
);

// Generate consistent color from string (same as formatters.js)
const getColorFromString = (str) => {
  if (!str) return '#6B7280';
  const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#22C55E',
    '#14B8A6', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6',
    '#A855F7', '#D946EF', '#EC4899', '#F43F5E'
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const UserAvatar = ({
  name,
  imageUrl,
  size = 'md',
  color,
  autoColor = true,
  className = "",
  onClick
}) => {
  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    xs: 'avatar--xs',
    sm: 'avatar--sm',
    md: 'avatar--md',
    lg: 'avatar--lg',
    xl: 'avatar--xl'
  };

  const showDefault = !name && !imageUrl;

  // Determine background color
  const bgColor = showDefault
    ? 'var(--color-gray-200)'
    : color || (autoColor ? getColorFromString(name) : 'var(--color-primary)');

  return (
    <div
      className={`avatar ${sizeClasses[size] || 'avatar--md'} ${showDefault ? 'avatar--default' : ''} ${className}`}
      style={{ backgroundColor: bgColor }}
      title={name || 'User'}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
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
