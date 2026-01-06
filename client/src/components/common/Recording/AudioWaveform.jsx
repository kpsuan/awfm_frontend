import React from 'react';
import './Recording.css';

const AudioWaveform = ({
  isPlaying = false,
  barCount = 20,
  className = ""
}) => {
  return (
    <div className={`audio-waveform ${className}`}>
      <div className="audio-waveform__container">
        {[...Array(barCount)].map((_, i) => (
          <span
            key={i}
            className={`audio-waveform__bar ${isPlaying ? 'audio-waveform__bar--active' : ''}`}
            style={{
              animationDelay: `${i * 0.05}s`,
              height: isPlaying ? `${Math.random() * 60 + 20}%` : '20%'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AudioWaveform;
