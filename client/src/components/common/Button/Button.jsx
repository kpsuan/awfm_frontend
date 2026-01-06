import React from 'react';
import { Loader2 } from 'lucide-react';
import './Button.css';

/**
 * Button Component
 *
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'ghost' | 'not-selected'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} fullWidth - If true, button takes full width
 * @param {boolean} disabled - Disabled state
 * @param {boolean} loading - Loading state with spinner
 * @param {React.ReactNode} leftIcon - Icon to display on the left
 * @param {React.ReactNode} rightIcon - Icon to display on the right
 * @param {string} type - 'button' | 'submit' | 'reset'
 * @param {string} className - Additional CSS classes
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  type = 'button',
  className = '',
  onClick,
  ...props
}) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full',
    loading && 'btn-loading',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="btn-spinner" aria-hidden="true">
          <Loader2 size={20} className="btn-spinner-icon" />
        </span>
      )}
      {!loading && leftIcon && <span className="btn-icon btn-icon--left">{leftIcon}</span>}
      <span className="btn-text">{children}</span>
      {!loading && rightIcon && <span className="btn-icon btn-icon--right">{rightIcon}</span>}
    </button>
  );
};

export default Button;
