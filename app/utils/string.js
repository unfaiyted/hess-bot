const EMOJIS = require("./constants/app.constants.js").EMOJIS;

/**
 * This takes a string and assigns the appropriate emojis to it.
 * @param str
 * @returns {[]}
 */
exports.stringToEmojisArray = (str) => {
    let spacerIndex = 0;
    const maxSpacerIndex = EMOJIS.spacers.length-1;

    const array = str.toLowerCase().split("");

    let emojiArray = [];

    for(const letter of array) {
        if(/[a-z]/.test(letter)) {
            emojiArray.push(EMOJIS.letters[letter])
        }

        if(/[ ]/.test(letter)) {
            emojiArray.push(EMOJIS.spacers[spacerIndex]);
            spacerIndex++;

            if(spacerIndex === maxSpacerIndex) spacerIndex = 0;
        }
    }
    return emojiArray;
};
