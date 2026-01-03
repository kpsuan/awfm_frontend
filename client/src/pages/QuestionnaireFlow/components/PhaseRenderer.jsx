import React from 'react';
import { PHASE_CONFIG } from '../config/phaseConfig';

/**
 * PhaseRenderer Component
 * Renders the appropriate component for the current phase using configuration
 * @param {string} phase - Current phase from FLOW_PHASES
 * @param {Object} context - Context object with all data and handlers needed by phases
 */
const PhaseRenderer = ({ phase, context }) => {
  const config = PHASE_CONFIG[phase];

  if (!config) {
    return (
      <div className="loading-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  const Component = config.component;
  const props = config.getProps(context);

  return <Component {...props} />;
};

export default PhaseRenderer;
