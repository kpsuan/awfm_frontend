import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import splashAnimation from '../../../styles/splash.json';
import './SplashScreen.css';

const SplashScreen = ({ onComplete, duration = 3000 }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out before completion
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, duration - 500);

    // Call onComplete after animation
    const completeTimer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  return (
    <div className={`splash-screen ${fadeOut ? 'splash-screen--fade-out' : ''}`}>
      <div className="splash-screen__content">
        <div className="splash-screen__animation">
          <Lottie
            animationData={splashAnimation}
            loop={true}
            autoplay={true}
          />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
