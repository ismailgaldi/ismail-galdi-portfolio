/**
 * Main Entry Point
 * Initialize styles and app
 */

// Import styles
import './styles/main.css';

// Import app
import { initApp } from './js/app.js';

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});
