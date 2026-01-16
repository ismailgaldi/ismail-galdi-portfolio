/**
 * Preloader Component
 * Handles preloader animation and progress
 */

import gsap from 'gsap';
import { prefersReducedMotion } from '../utils/reducedMotion.js';

/**
 * Initialize preloader
 * @returns {Promise} - Resolves when preloader is complete
 */
export function initPreloader() {
    return new Promise((resolve) => {
        const preloader = document.getElementById('preloader');
        const monogram = preloader.querySelector('.preloader__monogram');
        const progressBar = preloader.querySelector('.preloader__progress-bar');
        const text = preloader.querySelector('.preloader__text');

        if (prefersReducedMotion()) {
            // Skip animation, just hide
            preloader.classList.add('is-complete');
            gsap.set(preloader, { autoAlpha: 0 });
            resolve();
            return;
        }

        // Intro animation
        const tl = gsap.timeline({
            onComplete: () => {
                // Exit animation
                gsap.to(preloader, {
                    autoAlpha: 0,
                    duration: 0.6,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        preloader.classList.add('is-complete');
                        resolve();
                    }
                });
            }
        });

        // Animate in
        tl.to(monogram, {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out'
        })
            .to(text, {
                opacity: 1,
                duration: 0.4
            }, '-=0.4')
            .to(progressBar, {
                width: '100%',
                duration: 1.5,
                ease: 'power2.inOut'
            }, '-=0.2');

        // Pulsing glow effect on monogram
        gsap.to(monogram, {
            textShadow: '0 0 80px rgba(182, 255, 59, 0.8)',
            duration: 0.8,
            repeat: 2,
            yoyo: true,
            ease: 'power2.inOut'
        });
    });
}
