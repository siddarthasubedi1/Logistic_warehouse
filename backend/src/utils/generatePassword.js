const crypto = require("crypto");

const generatePassword = () => {
    const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lower = "abcdefghijkmnopqrstuvwxyz";
    const numbers = "23456789";
    const symbols = "!@#$%^&*";

    const allCharacters =
        upper + lower + numbers + symbols;

    const passwordCharacters = [
        upper[crypto.randomInt(upper.length)],
        lower[crypto.randomInt(lower.length)],
        numbers[crypto.randomInt(numbers.length)],
        symbols[crypto.randomInt(symbols.length)],
    ];

    while (passwordCharacters.length < 14) {
        passwordCharacters.push(
            allCharacters[
            crypto.randomInt(allCharacters.length)
            ]
        );
    }

    for (
        let i = passwordCharacters.length - 1;
        i > 0;
        i--
    ) {
        const j = crypto.randomInt(i + 1);

        [
            passwordCharacters[i],
            passwordCharacters[j],
        ] = [
                passwordCharacters[j],
                passwordCharacters[i],
            ];
    }

    return passwordCharacters.join("");
};

module.exports = generatePassword;