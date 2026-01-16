/**
 * Projects Section
 * Pinned horizontal scroll with GSAP
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitText } from '../utils/splitText.js';
import { prefersReducedMotion } from '../utils/reducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

let isMobile = false;

/**
 * Initialize projects section
 */
export function initProjects() {
    const projects = document.getElementById('projects');
    const title = projects.querySelector('.projects__title');
    const track = projects.querySelector('.projects__track');
    const panels = projects.querySelectorAll('.project-panel');
    const currentEl = projects.querySelector('.projects__current');
    const accentLine = projects.querySelector('.projects__accent-line');

    // Check if mobile
    isMobile = window.innerWidth < 768;

    if (prefersReducedMotion()) {
        gsap.set([title, ...panels.values()], { opacity: 1 });
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

    // Use GSAP matchMedia for responsive behavior
    ScrollTrigger.matchMedia({
        // Desktop: Horizontal scroll
        "(min-width: 769px)": function () {
            setupHorizontalScroll(projects, track, panels, currentEl, accentLine);
        },

        // Mobile: Vertical stacked cards
        "(max-width: 768px)": function () {
            setupVerticalCards(panels);
        }
    });
}

/**
 * Desktop: Horizontal pinned scroll
 */
function setupHorizontalScroll(projects, track, panels, currentEl, accentLine) {
    const panelWidth = panels[0].offsetWidth;
    const totalWidth = panelWidth * panels.length;
    const scrollDistance = totalWidth - window.innerWidth;

    // Main horizontal scroll
    const scrollTween = gsap.to(track, {
        x: -scrollDistance,
        ease: 'none',
        scrollTrigger: {
            trigger: projects,
            start: 'top top',
            end: `+=${scrollDistance}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
                // Update counter
                const panelIndex = Math.min(
                    Math.floor(self.progress * panels.length),
                    panels.length - 1
                );
                if (currentEl) {
                    currentEl.textContent = String(panelIndex + 1).padStart(2, '0');
                }

                // Move accent line
                if (accentLine) {
                    gsap.set(accentLine, {
                        x: self.progress * window.innerWidth
                    });
                }
            }
        }
    });

    // Per-panel animations
    panels.forEach((panel, index) => {
        const title = panel.querySelector('.project-panel__title');
        const image = panel.querySelector('.project-panel__image-wrapper');
        const content = panel.querySelector('.project-panel__content');
        const tags = panel.querySelectorAll('.tag');

        // Split title
        if (title) {
            const titleSplit = splitText(title, { type: 'words' });

            // Animate as panel comes into view
            gsap.timeline({
                scrollTrigger: {
                    trigger: panel,
                    containerAnimation: scrollTween,
                    start: 'left 80%',
                    end: 'left 30%',
                    scrub: 1
                }
            })
                .to(title, { opacity: 1, duration: 0.01 })
                .from(titleSplit.words, {
                    y: 30,
                    opacity: 0,
                    stagger: 0.05,
                    duration: 0.3
                });
        }

        // Image reveal with blur
        if (image) {
            gsap.from(image, {
                scale: 1.1,
                filter: 'blur(10px)',
                opacity: 0,
                scrollTrigger: {
                    trigger: panel,
                    containerAnimation: scrollTween,
                    start: 'left 90%',
                    end: 'left 50%',
                    scrub: 1
                }
            });
        }

        // Tags slide up
        if (tags.length) {
            gsap.from(tags, {
                y: 20,
                opacity: 0,
                stagger: 0.05,
                scrollTrigger: {
                    trigger: panel,
                    containerAnimation: scrollTween,
                    start: 'left 60%',
                    end: 'left 30%',
                    scrub: 1
                }
            });
        }
    });
}

/**
 * Mobile: Vertical stacked cards with reveal
 */
function setupVerticalCards(panels) {
    panels.forEach((panel, index) => {
        const title = panel.querySelector('.project-panel__title');
        const image = panel.querySelector('.project-panel__image-wrapper');
        const content = panel.querySelector('.project-panel__content');

        // Simple fade in on scroll
        gsap.from(panel, {
            y: 60,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: panel,
                start: 'top 85%',
                once: true
            }
        });

        // Title reveal
        if (title) {
            gsap.to(title, {
                opacity: 1,
                scrollTrigger: {
                    trigger: panel,
                    start: 'top 80%',
                    once: true
                }
            });
        }
    });
}
