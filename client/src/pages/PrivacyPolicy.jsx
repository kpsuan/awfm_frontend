import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-container">
      <div className="legal-card">
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-updated">Last updated: January 2, 2026</p>

        <div className="legal-content">
          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to A Whole Family Matter ("AWFM", "we", "us", or "our"). We are committed to protecting
              your personal information and your right to privacy. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our interdependent care planning platform.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul>
              <li>Account information (email address, display name, password)</li>
              <li>Profile information (name, pronouns, bio, profile photo)</li>
              <li>Care planning responses and questionnaire data</li>
              <li>Healthcare worker attestation status</li>
              <li>Communication preferences</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process your care planning activities</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Protect against fraudulent or illegal activity</li>
            </ul>
          </section>

          <section>
            <h2>4. Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul>
              <li>With your consent or at your direction</li>
              <li>With service providers who assist in our operations</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
            </ul>
          </section>

          <section>
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2>6. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed to provide
              you services. If you delete your account, we will retain your data for 30 days before permanent deletion,
              allowing you to restore your account if needed.
            </p>
          </section>

          <section>
            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and data</li>
              <li>Export your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2>8. AI and Automated Processing</h2>
            <p>
              Our platform uses artificial intelligence to assist with care planning recommendations and content
              organization. AI-generated content is clearly labeled. You maintain control over all final decisions
              regarding your care plans.
            </p>
          </section>

          <section>
            <h2>9. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our practices, please contact us at:
            </p>
            <p className="legal-contact">
              Email: privacy@awholefamilymatter.com<br />
              Address: [Placeholder Address]
            </p>
          </section>
        </div>

        <div className="legal-footer">
          <Link to="/terms" className="legal-link">Terms of Service</Link>
          <span className="legal-separator">|</span>
          <Link to="/register" className="legal-link">Back to Registration</Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
