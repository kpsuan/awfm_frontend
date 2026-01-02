import React, { useState } from 'react';
import Modal from './Modal';
import { Button } from '../Button';
import './ConsentModal.css';

const ConsentTermsModal = ({ isOpen, onClose, onAgree, initialChecked = false }) => {
  const [agreed, setAgreed] = useState(initialChecked);

  const handleAgree = () => {
    if (agreed) {
      onAgree();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Terms of Service & Privacy Policy" size="large">
      <div className="consent-modal">
        <div className="consent-modal__content">
          {/* Terms of Service */}
          <section className="consent-modal__section">
            <h3>Terms of Service</h3>
            <p><strong>Last updated:</strong> January 2025</p>

            <h4>1. Acceptance of Terms</h4>
            <p>
              By accessing and using this platform, you accept and agree to be bound by the terms
              and provisions of this agreement. If you do not agree to abide by these terms, please
              do not use this service.
            </p>

            <h4>2. Description of Service</h4>
            <p>
              This platform provides AI-assisted care planning tools designed to help users create,
              manage, and share advance care planning documents. The service is intended for
              informational purposes and should not replace professional medical or legal advice.
            </p>

            <h4>3. User Responsibilities</h4>
            <ul>
              <li>Provide accurate and truthful information</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Use the service in compliance with applicable laws</li>
              <li>Respect the privacy and rights of others</li>
            </ul>

            <h4>4. Healthcare Disclaimer</h4>
            <p>
              This platform does not provide medical advice, diagnosis, or treatment. Always consult
              with qualified healthcare professionals regarding your medical conditions and care decisions.
              The AI-generated suggestions are meant to assist, not replace, professional guidance.
            </p>

            <h4>5. Limitation of Liability</h4>
            <p>
              We shall not be liable for any indirect, incidental, special, consequential, or punitive
              damages resulting from your use of or inability to use the service.
            </p>
          </section>

          {/* Privacy Policy */}
          <section className="consent-modal__section">
            <h3>Privacy Policy</h3>
            <p><strong>Last updated:</strong> January 2025</p>

            <h4>1. Information We Collect</h4>
            <p>We collect information you provide directly to us, including:</p>
            <ul>
              <li>Account information (name, email, password)</li>
              <li>Profile information and preferences</li>
              <li>Care planning data and responses</li>
              <li>Communications with our support team</li>
            </ul>

            <h4>2. How We Use Your Information</h4>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Personalize your experience with AI-assisted features</li>
              <li>Send you important updates about your account</li>
              <li>Protect against fraud and unauthorized access</li>
            </ul>

            <h4>3. Data Security</h4>
            <p>
              We implement appropriate security measures to protect your personal information.
              Your data is encrypted in transit and at rest. We regularly review and update
              our security practices.
            </p>

            <h4>4. Data Sharing</h4>
            <p>
              We do not sell your personal information. We may share data only with your explicit
              consent, with service providers who assist our operations, or when required by law.
            </p>

            <h4>5. Your Rights</h4>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Export your data in a portable format</li>
            </ul>

            <h4>6. Contact Us</h4>
            <p>
              If you have questions about these policies, please contact us at support@example.com
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
              I have read and agree to the Terms of Service and Privacy Policy
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
              I Agree
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConsentTermsModal;
