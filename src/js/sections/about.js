/**
 * About Section
 * About animations and parallax effects
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitText } from '../utils/splitText.js';
import { prefersReducedMotion } from '../utils/reducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize about section animations
 */
export function initAbout() {
    const about = document.getElementById('about');
    const title = about.querySelector('.about__title');
    const texts = about.querySelectorAll('.about__text');
    const chips = about.querySelectorAll('.chip');
    const tools = about.querySelectorAll('.tool');
    const portrait = about.querySelector('.about__portrait-wrapper');
    const watermark = about.querySelector('.about__watermark');

    if (prefersReducedMotion()) {
        // Instant reveal
        gsap.set([title, ...texts, ...chips, ...tools], { opacity: 1, y: 0 });
        return;
    }

    // Split title
    const titleSplit = splitText(title, { type: 'words' });

    // Title animation
    gsap.timeline({
        scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            once: true
        }
    })
        .to(title, { opacity: 1, duration: 0.01 })
        .from(titleSplit.words, {
            x: -50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: 'power3.out'
        });

    // Bio paragraphs stagger
    texts.forEach((text, i) => {
        gsap.to(text, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: text,
                start: 'top 85%',
                once: true
            },
            delay: i * 0.1
        });
    });

    // Chips pop-in with stagger
    gsap.from(chips, {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(1.5)',
        scrollTrigger: {
            trigger: chips[0]?.parentElement,
            start: 'top 85%',
            once: true
        }
    });

    // Tools reveal
    gsap.from(tools, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: tools[0]?.parentElement,
            start: 'top 85%',
            once: true
        }
    });

    // Portrait parallax
    if (portrait) {
        gsap.to(portrait, {
            y: -50,
            rotation: 2,
            ease: 'none',
            scrollTrigger: {
                trigger: about,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    }

    // Watermark drift
    if (watermark) {
        gsap.to(watermark, {
            x: 100,
            ease: 'none',
            scrollTrigger: {
                trigger: about,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2
            }
        });
    }
}
