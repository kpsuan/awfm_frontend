import React, { useState } from 'react';
import Modal from './Modal';
import { Button } from '../Button';
import './ConsentModal.css';

const ConsentAIModal = ({ isOpen, onClose, onAgree, initialChecked = false }) => {
  const [agreed, setAgreed] = useState(initialChecked);

  const handleAgree = () => {
    if (agreed) {
      onAgree();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Human & AI Collaboration" size="medium">
      <div className="consent-modal">
        <div className="consent-modal__content consent-modal__content--compact">
          {/* AI Icon */}
          <div className="consent-modal__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13A1.5 1.5 0 0 0 6 14.5A1.5 1.5 0 0 0 7.5 16A1.5 1.5 0 0 0 9 14.5A1.5 1.5 0 0 0 7.5 13m9 0a1.5 1.5 0 0 0-1.5 1.5a1.5 1.5 0 0 0 1.5 1.5a1.5 1.5 0 0 0 1.5-1.5a1.5 1.5 0 0 0-1.5-1.5" />
            </svg>
          </div>

          <section className="consent-modal__section">
            <h3>How We Use AI</h3>
            <p>
              This platform uses artificial intelligence to assist with your care planning journey.
              Our AI helps generate suggestions, organize information, and provide personalized guidance
              based on your responses.
            </p>

            <h4>AI-Generated Content</h4>
            <p>
              Content created or suggested by AI will always be clearly labeled with an indicator
              so you know when you're viewing AI-assisted content versus human-written content.
            </p>

            <h4>Your Control</h4>
            <p>
              <strong>You maintain full control</strong> over all your care decisions. AI suggestions
              are meant to help you think through options and organize your thoughts, but the final
              decisions are always yours to make.
            </p>

            <h4>Human Oversight</h4>
            <p>
              Our AI systems are designed with human oversight in mind. We encourage you to:
            </p>
            <ul>
              <li>Review all AI-generated suggestions carefully</li>
              <li>Discuss important decisions with family, friends, or healthcare providers</li>
              <li>Edit or reject any AI suggestions that don't reflect your wishes</li>
              <li>Consult professionals for medical or legal advice</li>
            </ul>

            <h4>Limitations</h4>
            <p>
              AI is a tool to assist you, not replace professional advice. Our AI may not always
              understand nuanced situations perfectly. Always use your judgment and seek professional
              guidance when needed.
            </p>
          </section>
        </div>

        <div className="consent-modal__footer">
          <label className="consent-modal__checkbox">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              I understand that this platform uses AI assistance and that AI-generated content will be clearly identified
            </span>
          </label>
          <div className="consent-modal__actions">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAgree}
              disabled={!agreed}
            >
              I Understand
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConsentAIModal;
