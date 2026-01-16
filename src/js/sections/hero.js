/**
 * Hero Section
 * Hero animations and scroll effects
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitText } from '../utils/splitText.js';
import { prefersReducedMotion } from '../utils/reducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize hero section animations
 */
export function initHero() {
    const hero = document.getElementById('hero');
    const title = hero.querySelector('.hero__title');
    const subtitle = hero.querySelector('.hero__subtitle');
    const role = hero.querySelector('.hero__role');
    const tagline = hero.querySelector('.hero__tagline');
    const scrollIndicator = hero.querySelector('.hero__scroll-indicator');
    const canvas = document.getElementById('hero-canvas');

    // Split text for animation
    const titleSplit = splitText(title, { type: 'words' });

    if (prefersReducedMotion()) {
        // Instant reveal
        gsap.set([title, subtitle, tagline, scrollIndicator], { opacity: 1 });
        return;
    }

    // Hero entrance timeline
    const tl = gsap.timeline({ delay: 0.2 });

    // Title words stagger in
    tl.to(title, { opacity: 1, duration: 0.01 })
        .from(titleSplit.words, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out'
        })
        // Subtitle slide in
        .to(subtitle, {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.4')
        // Role underline draws
        .to(role, {
            '--underline-width': '100%',
            duration: 0.6,
            ease: 'power2.out',
            onStart: () => {
                role.style.setProperty('--underline-width', '0%');
            }
        }, '-=0.3')
        // Tagline fades in
        .to(tagline, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.2')
        // Scroll indicator
        .to(scrollIndicator, {
            opacity: 1,
            duration: 0.4
        }, '-=0.2');

    // Scroll-triggered effects
    setupHeroScrollEffects(hero, canvas);
}

/**
 * Setup scroll-driven effects for hero
 */
function setupHeroScrollEffects(hero, canvas) {
    if (prefersReducedMotion()) return;

    // Hero pin with gradient shift
    ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: '+=80%',
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
            const progress = self.progress;

            // Shift background gradient
            const gradient = hero.querySelector('.hero__gradient');
            if (gradient) {
                gradient.style.opacity = 1 - progress * 0.5;
            }

            // Scale down title as morph prep
            const title = hero.querySelector('.hero__title');
            const scale = 1 - progress * 0.3;
            const yMove = progress * -50;
            gsap.set(title, {
                scale: scale,
                y: yMove,
                opacity: 1 - progress * 0.8
            });

            // Fade out canvas
            if (canvas) {
                gsap.set(canvas, {
                    opacity: 1 - progress,
                    scale: 1 - progress * 0.2
                });
            }
        }
    });

    // Hide scroll indicator on scroll
    const scrollIndicator = hero.querySelector('.hero__scroll-indicator');
    ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: '+=10%',
        onUpdate: (self) => {
            gsap.set(scrollIndicator, { opacity: 1 - self.progress * 3 });
        }
    });
}
