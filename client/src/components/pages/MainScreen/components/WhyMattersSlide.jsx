import React from 'react';

/**
 * Slide 0: "Why this Matters" - Educational content
 */
const WhyMattersSlide = ({ title, content }) => (
  <div className="main-screen__slide-content">
    <h3 className="main-screen__slide-title">{title}</h3>
    {content.map((item, idx) => (
      <p key={idx} className="main-screen__slide-text">{item.text}</p>
    ))}
  </div>
);

export default WhyMattersSlide;
