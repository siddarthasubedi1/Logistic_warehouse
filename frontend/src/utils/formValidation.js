/** Client-side feedback; server validates the same rules independently. */
const namePattern = /^[\p{L}\p{M}]+(?:[\p{L}\p{M}\s'.-]*[\p{L}\p{M}])?$/u;
const emailPattern = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;
export function validateUserDetails(values) {
    for (const [label, key] of [['First', 'firstName'], ['Last', 'lastName']]) {
        const name = values[key];
        if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 60 || !namePattern.test(name.trim())) {
            return `${label} name must be 2–60 characters and contain only letters, spaces, apostrophes, periods or hyphens.`;
        }
    }
    const ageText = values.age;
    if (ageText === '' || ageText === null || ageText === undefined || !Number.isInteger(Number(ageText)) || Number(ageText) < 16 || Number(ageText) > 100) {
        return 'Age must be a whole number between 16 and 100.';
    }
    const email = typeof values.email === 'string' ? values.email.trim() : '';
    if (email.length > 254 || email.length < 5 || !emailPattern.test(email) || email.split('@')[0].length > 64) {
        return 'Please enter a valid email address (maximum 254 characters).';
    }
    if (typeof values.phoneNumber !== 'string' || !/^\d{10}$/.test(values.phoneNumber.trim())) {
        return 'Phone number must contain exactly 10 digits (no spaces or symbols).';
    }
    if (typeof values.address !== 'string' || values.address.trim().length < 5 || values.address.trim().length > 250) {
        return 'Address must be between 5 and 250 characters.';
    }
    if (!['male', 'female', 'other', 'prefer-not-to-say'].includes(values.gender)) {
        return 'Please select a valid gender option.';
    }
    return '';
}

export function validateNewPassword(password) {
    if (typeof password !== 'string' || password.length < 12 || password.length > 128) {
        return 'New password must be between 12 and 128 characters.';
    }
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[^\w\s]/.test(password)) {
        return 'New password must include uppercase and lowercase letters, a number, and a symbol.';
    }
    if (/\s/.test(password)) return 'Password must not contain spaces or line breaks.';
    return '';
}
