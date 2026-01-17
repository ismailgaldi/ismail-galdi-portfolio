/**
 * Main App Orchestrator
 * Initialize all modules and coordinate app lifecycle
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Components
import { initPreloader } from './components/preloader.js';
import { initNav } from './components/nav.js';
import { initModal } from './components/modal.js';
import { initForm } from './components/form.js';

// Sections
import { initHero } from './sections/hero.js';
import { initAbout } from './sections/about.js';
import { initProjects } from './sections/projects.js';
import { initServices } from './sections/services.js';
import { initContact } from './sections/contact.js';

// Three.js
import { initHeroScene } from './three/heroScene.js';

// Utils
import { initLazyLoad } from './utils/lazyLoad.js';
import { prefersReducedMotion } from './utils/reducedMotion.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

let lenis = null;

/**
 * Initialize the application
 */
export async function initApp() {
    // Setup smooth scroll with Lenis
    setupLenis();

    // Run preloader
    await initPreloader();

    // Initialize components
    initNav(lenis);
    initModal();
    initForm();

    // Initialize Three.js scene (deferred for performance)
    requestAnimationFrame(() => {
        initHeroScene();
    });

    // Initialize section animations
    initHero();
    initAbout();
    initProjects();
    initServices();
    initContact();

    // Setup footer scroll-to-top
    setupScrollToTop();

    // Initialize lazy loading
    initLazyLoad();

    // Add noise overlay
    addNoiseOverlay();

    console.log('✨ Portfolio initialized');
}

/**
 * Setup Lenis smooth scroll with GSAP ticker integration
 */
function setupLenis() {
    // Skip smooth scroll if reduced motion preferred
    if (prefersReducedMotion()) {
        return;
    }

    lenis = new Lenis({
        duration: 1.0, // Reduced from 1.5 for snappier response
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.2, // Increased for more direct control
        touchMultiplier: 2,
        infinite: false,
    });

    // Integrate Lenis with GSAP ticker for smooth ScrollTrigger updates
    lenis.on('scroll', ScrollTrigger.update);

    // Use lag smoothing to prevent jumps during heavy tasks
    gsap.ticker.lagSmoothing(100, 16);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
}

/**
 * Setup footer scroll-to-top button
 */
function setupScrollToTop() {
    const scrollTopBtn = document.querySelector('.footer__scroll-top');

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            if (lenis) {
                lenis.scrollTo(0, { duration: 1.5 });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
}

/**
 * Add subtle noise overlay for texture
 */
function addNoiseOverlay() {
    const noise = document.createElement('div');
    noise.className = 'noise-overlay';
    noise.setAttribute('aria-hidden', 'true');
    document.body.appendChild(noise);
}

/**
 * Get Lenis instance (for external use)
 */
export function getLenis() {
    return lenis;
}
