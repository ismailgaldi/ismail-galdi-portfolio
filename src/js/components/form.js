/**
 * Contact Form Component
 * Form validation and submission handling
 */

/**
 * Initialize contact form
 */
export function initForm() {
    const form = document.getElementById('contact-form');
    const toast = document.getElementById('success-toast');

    if (!form) return;

    form.addEventListener('submit', handleSubmit);

    // Real-time validation
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearError(input));
    });
}

/**
 * Handle form submission
 */
async function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('.contact__submit');
    const toast = document.getElementById('success-toast');

    // Validate all fields
    const inputs = form.querySelectorAll('.form-input');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    if (!isValid) return;

    // Show loading state
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Success
    submitBtn.classList.remove('is-loading');
    submitBtn.disabled = false;

    // Reset form
    form.reset();

    // Show toast
    showToast(toast);
}

/**
 * Validate a single field
 */
function validateField(input) {
    const errorEl = document.getElementById(`${input.id}-error`);
    let message = '';

    // Required check
    if (input.hasAttribute('required') && !input.value.trim()) {
        message = 'This field is required';
    }

    // Email check
    if (input.type === 'email' && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
            message = 'Please enter a valid email';
        }
    }

    // Min length for message
    if (input.id === 'message' && input.value && input.value.length < 10) {
        message = 'Please write at least 10 characters';
    }

    if (message) {
        errorEl.textContent = message;
        input.setAttribute('aria-invalid', 'true');
        return false;
    }

    errorEl.textContent = '';
    input.setAttribute('aria-invalid', 'false');
    return true;
}

/**
 * Clear error for a field
 */
function clearError(input) {
    const errorEl = document.getElementById(`${input.id}-error`);
    if (errorEl) {
        errorEl.textContent = '';
    }
    input.removeAttribute('aria-invalid');
}

/**
 * Show success toast
 */
function showToast(toast) {
    toast.classList.add('is-visible');

    setTimeout(() => {
        toast.classList.remove('is-visible');
    }, 4000);
}
