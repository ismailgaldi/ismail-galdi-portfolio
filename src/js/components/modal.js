/**
 * Modal Component
 * Accessible modal with focus trap
 */

import gsap from 'gsap';

// Case study data
const caseStudies = {
    skybank: {
        title: 'SkyBank Mobile',
        problem: 'The existing banking app had a 60% drop-off rate during onboarding due to complex KYC requirements and outdated UI patterns. Users struggled to complete account setup, leading to poor conversion from download to active user.',
        solution: 'Redesigned the entire onboarding flow with progressive disclosure, breaking KYC into digestible steps with clear progress indicators. Introduced biometric verification and AI-powered document scanning to reduce manual input. Created a conversational chatbot for 24/7 support.',
        outcomes: [
            '40% reduction in onboarding time',
            '75% increase in completion rate',
            'NPS score improved from 32 to 67',
            'Support tickets reduced by 50%'
        ]
    },
    pulse: {
        title: 'Pulse Analytics',
        problem: 'The SaaS dashboard was designed for power users but alienated newcomers. Key metrics were buried, tables weren\'t responsive, and the information architecture made simple tasks unnecessarily complex.',
        solution: 'Conducted comprehensive UX audit with user interviews. Restructured IA based on user mental models. Redesigned data visualization with progressive complexity—simple summaries expandable to detailed views. Built responsive table components that adapt to any screen.',
        outcomes: [
            '65% improvement in task completion',
            '45% reduction in time-to-insight',
            'Mobile usage increased 3x',
            'Customer churn reduced by 28%'
        ]
    },
    eternal: {
        title: 'Eternal Beauty Clinic',
        problem: 'The clinic\'s website felt dated and didn\'t inspire trust. The booking process required phone calls, and there was no clear service presentation. Competitor sites were winning potential clients.',
        solution: 'Created a premium, trust-building design with real testimonials, before/after galleries, and detailed service pages. Implemented seamless online booking with calendar integration. Optimized landing pages for specific treatments with clear CTAs.',
        outcomes: [
            '3x increase in online bookings',
            '180% increase in organic traffic',
            'Bounce rate dropped from 65% to 28%',
            'Average session duration up 2.5x'
        ]
    },
    injoy: {
        title: 'iNJOY Self-Service',
        problem: 'Customers had to call support for basic account management tasks like SIM changes or complaint filing. This created support bottlenecks, long wait times, and customer frustration.',
        solution: 'Designed intuitive self-service flows for all major account management tasks. Created step-by-step wizards with inline help. Built a unified dashboard showing all active services, usage, and pending requests.',
        outcomes: [
            '35% reduction in support calls',
            '60% of SIM changes now self-service',
            'Average resolution time cut in half',
            'Customer satisfaction up 40 points'
        ]
    }
};

let modal = null;
let focusableElements = [];
let firstFocusable = null;
let lastFocusable = null;
let triggerElement = null;

/**
 * Initialize modal functionality
 */
export function initModal() {
    modal = document.getElementById('case-study-modal');

    // Case study buttons
    const caseStudyBtns = document.querySelectorAll('[data-case-study]');
    caseStudyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const studyId = btn.dataset.caseStudy;
            triggerElement = btn;
            openModal(studyId);
        });
    });

    // Close button
    const closeBtn = modal.querySelector('.modal__close');
    closeBtn.addEventListener('click', closeModal);

    // Backdrop click
    const backdrop = modal.querySelector('.modal__backdrop');
    backdrop.addEventListener('click', closeModal);

    // Escape key
    document.addEventListener('keydown', handleKeydown);
}

/**
 * Open modal with case study data
 */
function openModal(studyId) {
    const study = caseStudies[studyId];
    if (!study) return;

    // Populate content
    modal.querySelector('.modal__title').textContent = study.title;
    modal.querySelector('.modal__problem').textContent = study.problem;
    modal.querySelector('.modal__solution').textContent = study.solution;

    // Outcomes list
    const outcomesList = modal.querySelector('.modal__outcomes');
    outcomesList.innerHTML = study.outcomes
        .map(outcome => `<li>${outcome}</li>`)
        .join('');

    // Gallery placeholders
    const gallery = modal.querySelector('.modal__gallery');
    gallery.innerHTML = `
    <div class="modal__gallery-item">Image 1</div>
    <div class="modal__gallery-item">Image 2</div>
    <div class="modal__gallery-item">Image 3</div>
  `;

    // Show modal
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Animate
    gsap.fromTo(modal.querySelector('.modal__container'),
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'power3.out' }
    );
    gsap.fromTo(modal.querySelector('.modal__backdrop'),
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
    );

    // Setup focus trap
    setupFocusTrap();
}

/**
 * Close modal
 */
function closeModal() {
    gsap.to(modal.querySelector('.modal__container'), {
        scale: 0.95,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in'
    });
    gsap.to(modal.querySelector('.modal__backdrop'), {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';

            // Return focus to trigger
            if (triggerElement) {
                triggerElement.focus();
                triggerElement = null;
            }
        }
    });
}

/**
 * Setup focus trap within modal
 */
function setupFocusTrap() {
    focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length) {
        firstFocusable = focusableElements[0];
        lastFocusable = focusableElements[focusableElements.length - 1];
        firstFocusable.focus();
    }
}

/**
 * Handle keyboard events
 */
function handleKeydown(e) {
    if (!modal.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
        closeModal();
        return;
    }

    if (e.key === 'Tab') {
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    }
}

export { closeModal };
