const User = require("../models/User");

const cleanText = (text) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
};

const generateUsername = async (firstName, lastName) => {
    const first = cleanText(firstName);
    const last = cleanText(lastName);

    const baseUsername = `${first}.${last}`;

    let username = baseUsername;
    let number = 1;

    while (await User.exists({ username })) {
        username = `${baseUsername}${number}`;
        number++;
    }

    return username;
};

module.exports = generateUsername;