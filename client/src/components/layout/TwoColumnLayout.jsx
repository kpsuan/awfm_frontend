import React from 'react';
import './Layout.css';

const TwoColumnLayout = ({ children, isContentFocused = false }) => {
  return (
    <div className={`two-column-layout ${isContentFocused ? 'two-column-layout--focused' : ''}`}>
      {children}
    </div>
  );
};

export default TwoColumnLayout;
