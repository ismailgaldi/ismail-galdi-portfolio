/**
 * Contact Section
 * Contact form animations
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitText } from '../utils/splitText.js';
import { prefersReducedMotion } from '../utils/reducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize contact section animations
 */
export function initContact() {
    const contact = document.getElementById('contact');
    const title = contact.querySelector('.contact__title');
    const intro = contact.querySelector('.contact__intro');
    const formGroups = contact.querySelectorAll('.form-group');
    const submit = contact.querySelector('.contact__submit');
    const sidebarTitle = contact.querySelector('.contact__sidebar-title');
    const socials = contact.querySelectorAll('.contact__socials li');

    if (prefersReducedMotion()) {
        gsap.set([title, intro, ...formGroups, submit, sidebarTitle, ...socials], {
            opacity: 1,
            y: 0
        });
        return;
    }

    // Title with mask reveal effect
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
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.04,
            ease: 'power3.out'
        });

    // Intro
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

    // Form fields stagger
    formGroups.forEach((group, index) => {
        gsap.from(group, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: index * 0.1,
            scrollTrigger: {
                trigger: group,
                start: 'top 90%',
                once: true
            }
        });
    });

    // Submit button
    gsap.from(submit, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: submit,
            start: 'top 95%',
            once: true
        }
    });

    // Sidebar title
    gsap.to(sidebarTitle, {
        opacity: 1,
        duration: 0.6,
        scrollTrigger: {
            trigger: sidebarTitle,
            start: 'top 85%',
            once: true
        }
    });

    // Social links stagger
    gsap.from(socials, {
        x: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: socials[0],
            start: 'top 90%',
            once: true
        }
    });
}
