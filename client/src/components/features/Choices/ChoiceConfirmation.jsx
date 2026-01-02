import React from 'react';
import { Button } from '../../common/Button';
import './Choices.css';

const ChoiceConfirmation = ({ 
  choice,
  onConfirm,
  onCancel,
  isExpanded = false
}) => {
  if (!choice) return null;

  return (
    <div className={`choice-confirmation ${isExpanded ? 'choice-confirmation--expanded' : ''}`}>
      <div className="choice-confirmation__header">
        <span className="choice-confirmation__label">Are you sure?</span>
      </div>
      
      <div className="choice-confirmation__content">
        <div className="choice-confirmation__image">
          {choice.image ? (
            <img src={choice.image} alt={choice.title} />
          ) : (
            <div className="choice-confirmation__image-placeholder" />
          )}
        </div>
        
        <div className="choice-confirmation__details">
          <h4 className="choice-confirmation__title">{choice.title}</h4>
          {choice.description && (
            <p className="choice-confirmation__description">{choice.description}</p>
          )}
        </div>
      </div>

      <div className="choice-confirmation__actions">
        <Button variant="secondary" onClick={onCancel}>
          No, go back
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Yes, confirm
        </Button>
      </div>
    </div>
  );
};

export default ChoiceConfirmation;
