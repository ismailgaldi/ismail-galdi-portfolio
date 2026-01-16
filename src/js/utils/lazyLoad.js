/**
 * Lazy Load Utility
 * Lazy load images using IntersectionObserver
 */

/**
 * Initialize lazy loading for images
 * @param {string} selector - CSS selector for lazy images
 * @param {Object} options - IntersectionObserver options
 */
export function initLazyLoad(selector = '[data-lazy]', options = {}) {
    const {
        rootMargin = '50px 0px',
        threshold = 0.01,
    } = options;

    const images = document.querySelectorAll(selector);

    if (images.length === 0) return;

    // Check for IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
        // Fallback: load all images immediately
        images.forEach(img => loadImage(img));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadImage(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin, threshold });

    images.forEach(img => observer.observe(img));
}

/**
 * Load a single image
 * @param {HTMLElement} element - Image or element with data-lazy
 */
function loadImage(element) {
    const src = element.dataset.lazy;

    if (!src) return;

    if (element.tagName === 'IMG') {
        element.src = src;
        element.removeAttribute('data-lazy');
    } else {
        // Background image
        element.style.backgroundImage = `url(${src})`;
        element.removeAttribute('data-lazy');
    }

    element.classList.add('is-loaded');
}

/**
 * Preload critical images
 * @param {string[]} urls - Array of image URLs to preload
 * @returns {Promise} - Resolves when all images are loaded
 */
export function preloadImages(urls) {
    return Promise.all(
        urls.map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = url;
            });
        })
    );
}
