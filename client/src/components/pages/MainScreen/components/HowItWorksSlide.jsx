import React from 'react';

/**
 * Slide 1: "How it Works" - Shows layer progress
 */
const HowItWorksSlide = ({
  title,
  layers,
  headerRight,
  content,
  onGoToLayer
}) => (
  <div className="main-screen__slide-content">
    <h3 className="main-screen__slide-title">{title}</h3>
    <div className="main-screen__slide-header">
      <span className="main-screen__layers-label">{layers}</span>
      <span className="main-screen__progress-label">{headerRight}</span>
    </div>
    <div className="main-screen__checkpoints">
      {content.map((item, idx) => (
        <div
          key={idx}
          className={`main-screen__checkpoint-item ${item.completed ? 'main-screen__checkpoint-item--completed' : ''}`}
        >
          <div className="main-screen__checkpoint-header">
            <p className={`main-screen__checkpoint-link ${item.completed ? 'main-screen__checkpoint-link--completed' : ''}`}>
              {item.checkpoint}
            </p>
            {item.completed && (
              <span className="main-screen__checkpoint-check">✓</span>
            )}
            {onGoToLayer && (
              <button
                className="main-screen__go-to-layer-btn"
                onClick={() => onGoToLayer(item.layerNumber)}
                title={`Go to Layer ${item.layerNumber}`}
              >
                Go →
              </button>
            )}
          </div>
          <p className="main-screen__checkpoint-desc">{item.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default HowItWorksSlide;
