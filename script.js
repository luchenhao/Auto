document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References
    const passwordDisplay = document.getElementById('password-display');
    const copyBtn = document.getElementById('copy-btn');
    const lengthInput = document.getElementById('length');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const generateBtn = document.getElementById('generate-btn');

    // Character Sets
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{};\':"\\|,.<>/?';

    /**
     * Generates a cryptographically secure random number.
     * @param {number} max - The maximum value (exclusive).
     * @returns {number} A random number between 0 (inclusive) and max (exclusive).
     */
    function getRandomNumber(max) {
        const randomValues = new Uint32Array(1);
        window.crypto.getRandomValues(randomValues);
        return randomValues[0] % max;
    }

    /**
     * Generates a password based on specified criteria.
     * @param {number} length - The desired length of the password.
     * @param {boolean} includeLowercase - Whether to include lowercase characters.
     * @param {boolean} includeUppercase - Whether to include uppercase characters.
     * @param {boolean} includeNumbers - Whether to include numeric characters.
     * @param {boolean} includeSymbols - Whether to include symbolic characters.
     * @returns {string} The generated password.
     */
    function generatePassword(length, includeLowercase, includeUppercase, includeNumbers, includeSymbols) {
        let availableChars = '';
        if (includeLowercase) availableChars += lowercaseChars;
        if (includeUppercase) availableChars += uppercaseChars;
        if (includeNumbers) availableChars += numberChars;
        if (includeSymbols) availableChars += symbolChars;

        if (availableChars === '') {
            // Default to lowercase if no options are selected, or alert the user
            alert('Please select at least one character type. Defaulting to lowercase.');
            availableChars = lowercaseChars;
            if (!lowercaseCheckbox.checked) lowercaseCheckbox.checked = true; // Visually check it
        }

        if (length <= 0) { // Should be caught by min attribute, but good to double check
            return '';
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = getRandomNumber(availableChars.length);
            password += availableChars[randomIndex];
        }
        return password;
    }

    // Event Listener for "Generate Password" Button
    generateBtn.addEventListener('click', () => {
        const length = parseInt(lengthInput.value, 10);
        const includeLowercase = lowercaseCheckbox.checked;
        const includeUppercase = uppercaseCheckbox.checked;
        const includeNumbers = numbersCheckbox.checked;
        const includeSymbols = symbolsCheckbox.checked;

        // Validate length
        const minLength = parseInt(lengthInput.min, 10);
        const maxLength = parseInt(lengthInput.max, 10);

        if (isNaN(length) || length < minLength || length > maxLength) {
            alert(`Password length must be a number between ${minLength} and ${maxLength}.`);
            lengthInput.focus();
            return;
        }

        const password = generatePassword(length, includeLowercase, includeUppercase, includeNumbers, includeSymbols);
        passwordDisplay.value = password;
    });

    // Event Listener for "Copy Password" Button
    copyBtn.addEventListener('click', () => {
        const passwordToCopy = passwordDisplay.value;
        if (!passwordToCopy) {
            alert('Nothing to copy. Generate a password first.');
            return;
        }

        navigator.clipboard.writeText(passwordToCopy)
            .then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 1500); // Revert text after 1.5 seconds
            })
            .catch(err => {
                console.error('Failed to copy password: ', err);
                alert('Failed to copy password. Please try again or copy manually.');
            });
    });

    // Initial Password Generation on page load
    function generateInitialPassword() {
        const initialLength = parseInt(lengthInput.value, 10); // Use default length from input
        const password = generatePassword(
            initialLength,
            lowercaseCheckbox.checked,
            uppercaseCheckbox.checked,
            numbersCheckbox.checked,
            symbolsCheckbox.checked
        );
        passwordDisplay.value = password;
    }

    generateInitialPassword();
});
