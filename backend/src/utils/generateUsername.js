const User = require("../models/User");

const cleanText = (text) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
};

const generateUsername = async (firstName, lastName) => {
    // Usernames are ASCII-safe and bounded even when a legal name is long or
    // written in a script that has no straightforward ASCII transliteration.
    const first = cleanText(String(firstName || '').normalize('NFKD')).slice(0, 35);
    const last = cleanText(String(lastName || '').normalize('NFKD')).slice(0, 35);
    const suffix = require('node:crypto').randomBytes(4).toString('hex');
    const baseUsername = `${first || `user${suffix}`}.${last || `account${suffix}`}`;

    let username = baseUsername;
    let number = 1;

    while (await User.exists({ username })) {
        username = `${baseUsername}${number}`;
        number++;
    }

    return username;
};

module.exports = generateUsername;