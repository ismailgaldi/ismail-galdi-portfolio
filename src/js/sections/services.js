/**
 * Services Section
 * Service cards with stagger reveal and icon animations
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitText } from '../utils/splitText.js';
import { prefersReducedMotion } from '../utils/reducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize services section
 */
export function initServices() {
    const services = document.getElementById('services');
    const title = services.querySelector('.services__title');
    const intro = services.querySelector('.services__intro');
    const cards = services.querySelectorAll('.service-card');
    const gridPattern = services.querySelector('.services__grid-pattern');

    if (prefersReducedMotion()) {
        gsap.set([title, intro, ...cards], { opacity: 1, y: 0 });
        return;
    }

    // Title animation
    const titleSplit = splitText(title, { type: 'words' });
    gsap.timeline({
        scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            once: true
        }
    })
        .to(title, { opacity: 1, duration: 0.01 })
        .from(titleSplit.words, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.06,
            ease: 'power3.out'
        });

    // Intro paragraph
    gsap.to(intro, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: intro,
            start: 'top 85%',
            once: true
        }
    });

    // Cards stagger reveal
    cards.forEach((card, index) => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: index * 0.1,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                once: true
            }
        });

        // Icon line-draw animation on hover (CSS handles this)
        // But we can make icons animate on scroll too
        const icon = card.querySelector('.service-card__icon svg');
        if (icon) {
            const paths = icon.querySelectorAll('path, rect, circle, line, ellipse, polygon');

            // Set initial state
            paths.forEach(path => {
                const length = path.getTotalLength ? path.getTotalLength() : 200;
                gsap.set(path, {
                    strokeDasharray: length,
                    strokeDashoffset: length
                });
            });

            // Animate on scroll
            gsap.to(paths, {
                strokeDashoffset: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    once: true
                }
            });
        }
    });

    // Background grid parallax
    if (gridPattern) {
        gsap.to(gridPattern, {
            backgroundPosition: '40px 40px',
            ease: 'none',
            scrollTrigger: {
                trigger: services,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2
            }
        });
    }
}
