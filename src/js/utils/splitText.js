/**
 * Split Text Utility
 * Split text into words and characters for animation
 */

/**
 * Split text content into animated elements
 * @param {HTMLElement} element - Element containing text to split
 * @param {Object} options - Split options
 * @returns {Object} - Object with words and chars arrays
 */
export function splitText(element, options = {}) {
    const {
        type = 'words', // 'words', 'chars', or 'both'
        wordClass = 'word',
        charClass = 'char',
    } = options;

    const text = element.textContent;
    const words = text.split(/\s+/).filter(word => word.length > 0);

    element.innerHTML = '';
    element.setAttribute('aria-label', text);

    const wordElements = [];
    const charElements = [];

    words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = wordClass;

        if (type === 'chars' || type === 'both') {
            // Split into characters
            [...word].forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.className = charClass;
                charSpan.textContent = char;
                charSpan.setAttribute('aria-hidden', 'true');
                wordSpan.appendChild(charSpan);
                charElements.push(charSpan);
            });
        } else {
            // Just words
            wordSpan.textContent = word;
            wordSpan.setAttribute('aria-hidden', 'true');
        }

        wordElements.push(wordSpan);
        element.appendChild(wordSpan);

        // Add space between words (except last)
        if (wordIndex < words.length - 1) {
            const space = document.createTextNode(' ');
            element.appendChild(space);
        }
    });

    return {
        words: wordElements,
        chars: charElements,
    };
}

/**
 * Initialize all elements with data-split attribute
 * @returns {Map} - Map of elements to their split results
 */
export function initSplitText() {
    const elements = document.querySelectorAll('[data-split]');
    const splitResults = new Map();

    elements.forEach(element => {
        const type = element.dataset.split || 'words';
        const result = splitText(element, { type });
        splitResults.set(element, result);
    });

    return splitResults;
}
