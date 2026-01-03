import { useRef, useCallback } from 'react';

/**
 * Custom hook for handling swipe gestures on touch devices
 * @param {Object} options - Configuration options
 * @param {Function} options.onSwipeLeft - Callback when swiping left
 * @param {Function} options.onSwipeRight - Callback when swiping right
 * @param {number} options.minSwipeDistance - Minimum distance to trigger swipe (default: 50)
 * @returns {Object} Touch event handlers to spread on the element
 */
export const useSwipeGesture = ({
  onSwipeLeft,
  onSwipeRight,
  minSwipeDistance = 50
} = {}) => {
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);

  const onTouchStart = useCallback((e) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchMove = useCallback((e) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStartRef.current || !touchEndRef.current) return;

    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }

    // Reset refs
    touchStartRef.current = null;
    touchEndRef.current = null;
  }, [onSwipeLeft, onSwipeRight, minSwipeDistance]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};

export default useSwipeGesture;
