import React, { useState } from 'react';
import { Star } from 'lucide-react';
import Modal from './Modal';
import './FeedbackModal.css';

const FEEDBACK_STORAGE_KEY = 'awfm_feedback_submitted';

// Rating options with emojis
const ratingOptions = [
  { value: 1, emoji: '😞', label: 'Very Unlikely' },
  { value: 2, emoji: '😕', label: 'Unlikely' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '🙂', label: 'Likely' },
  { value: 5, emoji: '😍', label: 'Very Likely' },
];

/**
 * Check if user has already submitted feedback
 */
export const hasFeedbackBeenSubmitted = () => {
  try {
    return localStorage.getItem(FEEDBACK_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

/**
 * Mark feedback as submitted in localStorage
 */
export const markFeedbackSubmitted = () => {
  try {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, 'true');
  } catch {
    // localStorage not available
  }
};

const FeedbackModal = ({
  isOpen,
  onClose,
  onSubmit,
  onSkip,
}) => {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return;

    setIsSubmitting(true);
    try {
      // Call the onSubmit callback with feedback data
      await onSubmit?.({ rating, comment });
      markFeedbackSubmitted();
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    // Don't mark as submitted when skipping - allow modal to show again later
    onSkip?.();
  };

  const handleClose = () => {
    // Reset state when closing
    setRating(null);
    setComment('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="small"
      showCloseButton={false}
    >
      <div className="feedback-modal">
        <div className="feedback-modal__header">
          <div className="feedback-modal__icon">
            <Star size={32} fill="#FFD700" color="#FFD700" />
          </div>
          <h3 className="feedback-modal__title">How likely are you to recommend us?</h3>
          <p className="feedback-modal__subtitle">Your feedback helps us improve the experience for everyone.</p>
        </div>

        <div className="feedback-modal__rating">
          {ratingOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`feedback-modal__rating-btn ${rating === option.value ? 'feedback-modal__rating-btn--selected' : ''}`}
              onClick={() => setRating(option.value)}
              aria-label={option.label}
              title={option.label}
            >
              <span className="feedback-modal__emoji">{option.emoji}</span>
            </button>
          ))}
        </div>

        {rating && (
          <p className="feedback-modal__rating-label">
            {ratingOptions.find(o => o.value === rating)?.label}
          </p>
        )}

        <div className="feedback-modal__comment">
          <textarea
            className="feedback-modal__textarea"
            placeholder="Tell us more about your experience (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
        </div>

        <div className="feedback-modal__actions">
          <button
            type="button"
            className="feedback-modal__btn feedback-modal__btn--primary"
            onClick={handleSubmit}
            disabled={!rating || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
          <button
            type="button"
            className="feedback-modal__btn feedback-modal__btn--secondary"
            onClick={handleSkip}
          >
            Skip
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FeedbackModal;
