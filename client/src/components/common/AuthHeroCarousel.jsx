import React, { useState, useEffect } from 'react';

// Carousel slides data
const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop',
    title: 'Seamless Collaboration',
    description: 'Work together with your care team to document your wishes and preferences.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&auto=format&fit=crop',
    title: 'Voice Your Values',
    description: 'Record your thoughts and let AI help articulate what matters most to you.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
  },
  {
    image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&auto=format&fit=crop',
    title: 'Peace of Mind',
    description: 'Ensure your healthcare decisions are documented and shared with those who matter.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

const AuthHeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        setIsAnimating(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    if (index === currentSlide) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 300);
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="auth-hero">
      {/* Background images - all preloaded */}
      {SLIDES.map((s, index) => (
        <div
          key={index}
          className={`auth-hero-bg ${index === currentSlide ? 'active' : ''}`}
        >
          <img src={s.image} alt="" />
        </div>
      ))}

      {/* Floating particles animation */}
      <div className="auth-hero-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>

      {/* Logo/Brand at top */}
      <div className="auth-hero-brand">
       
      </div>

      {/* Main content */}
      <div className="auth-hero-content">
        <h1 className="auth-hero-title">
          Welcome to<br />
          <span className="auth-hero-title-gradient">A Whole Family Matter</span>
        </h1>
        <p className="auth-hero-subtitle">
          Your journey to meaningful advance care planning starts here.
        </p>
      </div>

      {/* Animated feature card */}
      <div className={`auth-hero-feature ${isAnimating ? 'animating' : ''}`}>
        <div className="auth-hero-feature-icon">
          {slide.icon}
        </div>
        <h2 className="auth-hero-feature-title">{slide.title}</h2>
        <p className="auth-hero-feature-text">{slide.description}</p>
      </div>

      {/* Navigation dots */}
      <div className="auth-hero-dots">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            className={`auth-hero-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="auth-hero-progress">
        <div
          className="auth-hero-progress-bar"
          key={currentSlide}
        />
      </div>
    </div>
  );
};

export default AuthHeroCarousel;
