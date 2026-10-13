/**
 * Shared server-side validation for creation and editing of warehouse accounts.
 * Validate at the API boundary as well as in the Mongoose model; browsers
 * cannot be trusted to enforce input rules.
 */
const VALID_GENDERS = ['male', 'female', 'other', 'prefer-not-to-say'];
const FIELD_NAMES = ['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'age', 'gender'];
const namePattern = /^[\p{L}\p{M}]+(?:[\p{L}\p{M}\s'.-]*[\p{L}\p{M}])?$/u;
const emailPattern = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

function validateUserDetails(body, { partial = false } = {}) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return { error: 'User details must be an object.' };
    }
    const values = {};
    for (const field of FIELD_NAMES) {
        if (partial && body[field] === undefined) continue;
        const raw = body[field];
        if (field === 'age') {
            if (raw === null || raw === '' || typeof raw === 'boolean' || (typeof raw !== 'string' && typeof raw !== 'number')) {
                return { error: 'Age must be a whole number between 16 and 100.' };
            }
            const age = Number(raw);
            if (!Number.isInteger(age) || age < 16 || age > 100) {
                return { error: 'Age must be a whole number between 16 and 100.' };
            }
            values.age = age;
            continue;
        }
        if (typeof raw !== 'string') return { error: `${field} must be text.` };
        const value = raw.trim();
        switch (field) {
            case 'firstName':
            case 'lastName':
                if (value.length < 2 || value.length > 60 || !namePattern.test(value)) {
                    return { error: `${field === 'firstName' ? 'First' : 'Last'} name must be 2–60 characters and contain only letters, spaces, apostrophes, periods or hyphens.` };
                }
                break;
            case 'email':
                if (value.length > 254 || value.length < 5 || !emailPattern.test(value) || value.split('@')[0].length > 64) {
                    return { error: 'Please enter a valid email address (maximum 254 characters).' };
                }
                break;
            case 'phoneNumber':
                if (!/^\d{10}$/.test(value)) {
                    return { error: 'Phone number must contain exactly 10 digits (no spaces or symbols).' };
                }
                break;
            case 'address':
                if (value.length < 5 || value.length > 250) {
                    return { error: 'Address must be between 5 and 250 characters.' };
                }
                break;
            case 'gender':
                if (!VALID_GENDERS.includes(value.toLowerCase())) {
                    return { error: 'Please select a valid gender option.' };
                }
                break;
        }
        values[field] = ['email', 'gender'].includes(field) ? value.toLowerCase() : value;
    }
    return { values };
}

function validateNewPassword(password) {
    if (typeof password !== 'string' || password.length < 12 || password.length > 128) {
        return 'New password must be between 12 and 128 characters.';
    }
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[^\w\s]/.test(password)) {
        return 'New password must include uppercase and lowercase letters, a number, and a symbol.';
    }
    if (/\s/.test(password)) return 'Password must not contain spaces or line breaks.';
    return '';
}
module.exports = { validateUserDetails, validateNewPassword, FIELD_NAMES, VALID_GENDERS };
