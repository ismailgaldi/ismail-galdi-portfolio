/**
 * Reduced Motion Utility
 * Detect and respond to prefers-reduced-motion
 */

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get motion-aware duration
 * @param {number} duration - Normal duration in seconds
 * @returns {number} - Adjusted duration (0 if reduced motion)
 */
export function getMotionDuration(duration) {
    return prefersReducedMotion() ? 0 : duration;
}

/**
 * Get motion-aware animation config
 * @param {Object} config - GSAP animation config
 * @returns {Object} - Adjusted config
 */
export function getMotionConfig(config) {
    if (prefersReducedMotion()) {
        return {
            ...config,
            duration: 0,
            delay: 0,
            stagger: 0,
        };
    }
    return config;
}

/**
 * Add listener for reduced motion changes
 * @param {Function} callback - Function to call on change
 * @returns {Function} - Cleanup function
 */
export function onMotionPreferenceChange(callback) {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handler = (e) => callback(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
}
