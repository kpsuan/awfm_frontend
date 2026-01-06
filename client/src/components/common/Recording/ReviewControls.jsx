import React from 'react';
import { RotateCcw, Check } from 'lucide-react';
import './Recording.css';

const ReviewControls = ({
  type = 'video',
  onReRecord,
  onSubmit,
  isSubmitting = false,
  reRecordLabel,
  submitLabel,
  className = ""
}) => {
  const typeLabels = {
    video: 'video',
    audio: 'audio',
    text: 'text'
  };

  const defaultReRecordLabel = type === 'text' ? 'Edit' : 'Re-record';
  const defaultSubmitLabel = `Use this ${typeLabels[type]}`;

  return (
    <div className={`review-controls ${className}`}>
      <button
        className="review-controls__btn review-controls__btn--secondary"
        onClick={onReRecord}
        disabled={isSubmitting}
      >
        <RotateCcw size={20} />
        <span>{reRecordLabel || defaultReRecordLabel}</span>
      </button>
      <button
        className="review-controls__btn review-controls__btn--primary"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        <Check size={24} />
        <span>{submitLabel || defaultSubmitLabel}</span>
      </button>
    </div>
  );
};

export default ReviewControls;
