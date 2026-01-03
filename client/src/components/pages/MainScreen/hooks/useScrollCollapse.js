import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook to handle scroll-based header collapse
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Scroll threshold to trigger collapse (default: 50)
 * @param {string} options.scrollContainerSelector - Selector for scroll container
 * @returns {Object} { isCollapsed, scrollContainerRef }
 */
export const useScrollCollapse = ({
  threshold = 50,
  scrollContainerSelector = '.main-screen__right'
} = {}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const scrollContainerRef = useRef(null);
  const lastScrollTop = useRef(0);

  const handleScroll = useCallback((e) => {
    const scrollTop = e.target.scrollTop;

    // Collapse when scrolled past threshold
    if (scrollTop > threshold && !isCollapsed) {
      setIsCollapsed(true);
    } else if (scrollTop <= threshold && isCollapsed) {
      setIsCollapsed(false);
    }

    lastScrollTop.current = scrollTop;
  }, [threshold, isCollapsed]);

  useEffect(() => {
    // Find the scroll container
    const container = scrollContainerRef.current ||
      document.querySelector(scrollContainerSelector);

    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, scrollContainerSelector]);

  return {
    isCollapsed,
    scrollContainerRef
  };
};

export default useScrollCollapse;
