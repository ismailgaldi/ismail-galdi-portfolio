/**
 * Navigation Component
 * Handles nav visibility, active states, mobile menu
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize navigation
 * @param {Object} lenis - Lenis instance for smooth scroll
 */
export function initNav(lenis) {
    const nav = document.querySelector('.nav');
    const navBrand = nav.querySelector('.nav__brand');
    const navLinks = nav.querySelectorAll('.nav__link');
    const navToggle = nav.querySelector('.nav__toggle');
    const navMobile = nav.querySelector('.nav__mobile');
    const mobileLinks = nav.querySelectorAll('.nav__mobile-link');

    // Show nav after hero
    ScrollTrigger.create({
        trigger: '#hero',
        start: 'bottom 80%',
        onEnter: () => showNav(),
        onLeaveBack: () => hideNav(),
    });

    // Add scrolled state
    ScrollTrigger.create({
        trigger: 'body',
        start: 'top -50px',
        onEnter: () => nav.classList.add('is-scrolled'),
        onLeaveBack: () => nav.classList.remove('is-scrolled'),
    });

    // Active section tracking
    const sections = ['about', 'projects', 'services', 'contact'];

    sections.forEach(sectionId => {
        ScrollTrigger.create({
            trigger: `#${sectionId}`,
            start: 'top 40%',
            end: 'bottom 40%',
            onEnter: () => setActiveLink(sectionId),
            onEnterBack: () => setActiveLink(sectionId),
        });
    });

    // Smooth scroll to sections
    [...navLinks, ...mobileLinks].forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);

            if (target && lenis) {
                lenis.scrollTo(target, { offset: -80 });
                closeMobileMenu();
            }
        });
    });

    // Brand click scrolls to top
    navBrand.addEventListener('click', (e) => {
        e.preventDefault();
        if (lenis) {
            lenis.scrollTo(0);
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', toggleMobileMenu);

    // Close mobile menu on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMobile.classList.contains('is-open')) {
            closeMobileMenu();
        }
    });

    function showNav() {
        nav.classList.add('is-visible');
    }

    function hideNav() {
        nav.classList.remove('is-visible');
    }

    function setActiveLink(sectionId) {
        navLinks.forEach(link => {
            const linkSection = link.dataset.section;
            if (linkSection === sectionId) {
                link.classList.add('is-active');
            } else {
                link.classList.remove('is-active');
            }
        });
    }

    function toggleMobileMenu() {
        const isOpen = navMobile.classList.contains('is-open');
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        navMobile.classList.add('is-open');
        navMobile.setAttribute('aria-hidden', 'false');
        navToggle.setAttribute('aria-expanded', 'true');
        // Prevent body scroll
        if (lenis) lenis.stop();
    }

    function closeMobileMenu() {
        navMobile.classList.remove('is-open');
        navMobile.setAttribute('aria-hidden', 'true');
        navToggle.setAttribute('aria-expanded', 'false');
        // Restore body scroll
        if (lenis) lenis.start();
    }
}
