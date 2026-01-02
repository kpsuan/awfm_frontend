import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css';

const TermsOfService = () => {
  return (
    <div className="legal-container">
      <div className="legal-card">
        <h1 className="legal-title">Terms of Service</h1>
        <p className="legal-updated">Last updated: January 2, 2026</p>

        <div className="legal-content">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using A Whole Family Matter ("AWFM", "Service"), you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>
              AWFM is an interdependent care planning platform that helps individuals and families create,
              manage, and share care plans. The Service includes questionnaires, care plan generation,
              team collaboration features, and related tools.
            </p>
          </section>

          <section>
            <h2>3. User Accounts</h2>
            <p>To use certain features of the Service, you must create an account. You agree to:</p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2>4. User Responsibilities</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Service for any unlawful purpose</li>
              <li>Share false or misleading information</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with other users' use of the Service</li>
              <li>Upload malicious content or code</li>
            </ul>
          </section>

          <section>
            <h2>5. Healthcare Disclaimer</h2>
            <p>
              <strong>Important:</strong> AWFM is a care planning tool and does not provide medical advice,
              diagnosis, or treatment. The Service is not a substitute for professional medical advice.
              Always consult qualified healthcare providers for medical decisions.
            </p>
          </section>

          <section>
            <h2>6. AI-Assisted Features</h2>
            <p>
              Our Service uses artificial intelligence to assist with care planning. You acknowledge that:
            </p>
            <ul>
              <li>AI-generated content is provided for informational purposes only</li>
              <li>AI suggestions should be reviewed before implementation</li>
              <li>You are responsible for decisions made based on AI assistance</li>
              <li>AI content is clearly labeled throughout the platform</li>
            </ul>
          </section>

          <section>
            <h2>7. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by AWFM and are
              protected by copyright, trademark, and other intellectual property laws. Your care plans and
              personal content remain your property.
            </p>
          </section>

          <section>
            <h2>8. Privacy</h2>
            <p>
              Your use of the Service is also governed by our <Link to="/privacy">Privacy Policy</Link>,
              which is incorporated into these Terms by reference.
            </p>
          </section>

          <section>
            <h2>9. Termination</h2>
            <p>
              We may terminate or suspend your account at any time for violations of these Terms. You may
              delete your account at any time through your account settings. Upon deletion, your data will
              be retained for 30 days before permanent removal.
            </p>
          </section>

          <section>
            <h2>10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, AWFM shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages resulting from your use of the Service.
            </p>
          </section>

          <section>
            <h2>11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of significant
              changes via email or through the Service. Continued use after changes constitutes acceptance
              of the modified Terms.
            </p>
          </section>

          <section>
            <h2>12. Contact Us</h2>
            <p>
              If you have questions about these Terms, please contact us at:
            </p>
            <p className="legal-contact">
              Email: legal@awholefamilymatter.com<br />
              Address: [Placeholder Address]
            </p>
          </section>
        </div>

        <div className="legal-footer">
          <Link to="/privacy" className="legal-link">Privacy Policy</Link>
          <span className="legal-separator">|</span>
          <Link to="/register" className="legal-link">Back to Registration</Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
