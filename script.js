document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References
    const passwordDisplay = document.getElementById('password-display');
    const copyBtn = document.getElementById('copy-btn');
    const lengthSliderInput = document.getElementById('length-slider'); // Updated
    const lengthValueDisplay = document.getElementById('length-value'); // Added
    const lowercaseCheckbox = document.getElementById('lowercase');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const generateBtn = document.getElementById('generate-btn');

    // Update initial length display
    if (lengthSliderInput && lengthValueDisplay) {
        lengthValueDisplay.textContent = lengthSliderInput.value;
    }

    // Event listener for slider input to update display
    if (lengthSliderInput && lengthValueDisplay) {
        lengthSliderInput.addEventListener('input', () => {
            lengthValueDisplay.textContent = lengthSliderInput.value;
        });
    }

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
            alert('请至少选择一个字符类型。将默认使用小写字母。'); // Translated
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
        const length = parseInt(lengthSliderInput.value, 10); // Updated to use slider
        const includeLowercase = lowercaseCheckbox.checked;
        const includeUppercase = uppercaseCheckbox.checked;
        const includeNumbers = numbersCheckbox.checked;
        const includeSymbols = symbolsCheckbox.checked;

        // Validate length (slider inherently handles min/max for user, but good for programmatic changes)
        const minLength = parseInt(lengthSliderInput.min, 10);
        const maxLength = parseInt(lengthSliderInput.max, 10);

        if (isNaN(length) || length < minLength || length > maxLength) {
            // This validation is less likely to be triggered by user with a slider,
            // but kept for robustness if value is set programmatically.
            alert(`密码长度必须在 ${minLength} 和 ${maxLength} 之间。`); // Translated
            lengthSliderInput.focus();
            return;
        }

        const password = generatePassword(length, includeLowercase, includeUppercase, includeNumbers, includeSymbols);
        passwordDisplay.value = password;
    });

    // Event Listener for "Copy Password" Button
    copyBtn.addEventListener('click', () => {
        const passwordToCopy = passwordDisplay.value;
        if (!passwordToCopy) {
            alert('没有内容可复制。请先生成密码。'); // Translated
            return;
        }

        navigator.clipboard.writeText(passwordToCopy)
            .then(() => {
                const originalText = copyBtn.textContent; // This will be "复制" from HTML
                copyBtn.textContent = '已复制!'; // Translated
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 1500); // Revert text after 1.5 seconds
            })
            .catch(err => {
                console.error('Failed to copy password: ', err);
                alert('复制密码失败。请重试或手动复制。'); // Translated
            });
    });

    // Initial Password Generation on page load
    function generateInitialPassword() {
        if (lengthSliderInput && lengthValueDisplay) { // Ensure elements exist
            lengthValueDisplay.textContent = lengthSliderInput.value; // Set initial display
        }
        const initialLength = parseInt(lengthSliderInput.value, 10); // Use default length from slider
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
