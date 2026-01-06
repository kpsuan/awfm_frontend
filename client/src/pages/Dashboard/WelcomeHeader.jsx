import React from 'react';
import { Clock, ClipboardList } from 'lucide-react';
import ImageCarousel from './ImageCarousel';

const CAROUSEL_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1758686254041-88d7b6ecee8f?q=80&w=400&h=300&auto=format&fit=crop',
    alt: 'Healthcare planning',
  },
  {
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400&h=300&auto=format&fit=crop',
    alt: 'Medical consultation',
  },
  {
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&h=300&auto=format&fit=crop',
    alt: 'Family care',
  },
  {
    url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=400&h=300&auto=format&fit=crop',
    alt: 'Healthcare support',
  },
];

const WelcomeHeader = ({ userName, overallProgress, questionsCompleted, totalQuestions }) => {
  return (
    <div className="welcome-header">
      <div className="welcome-content">
        <span className="welcome-label">Your Journey</span>
        <h1 className="welcome-title">
          Welcome back,
          <span> </span>
          <span className="welcome-name">
            {userName}
            <svg className="welcome-underline" viewBox="0 0 200 12" preserveAspectRatio="none">
              <path d="M2 8 Q 50 2, 100 8 T 198 8" stroke="url(#underlineGradient)" strokeWidth="4" fill="none" strokeLinecap="round"/>
              <defs>
                <linearGradient id="underlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>
        <p className="welcome-subtitle">Continue planning your advance care directives</p>
      </div>
      <div className="welcome-visual">
        <ImageCarousel images={CAROUSEL_IMAGES} interval={5000} />
        <div className="welcome-stats">
          <div className="welcome-stat welcome-stat--progress">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{overallProgress}%</span>
              <span className="stat-label">Complete</span>
            </div>
          </div>
          <div className="welcome-stat welcome-stat--questions">
            <div className="stat-icon">
              <ClipboardList size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{questionsCompleted}/{totalQuestions}</span>
              <span className="stat-label">Questions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
