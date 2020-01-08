// This method checks if a sentence contains a word or a sequence of words
// Use this to verify that the voice command that is received in the websocket client
// contains the words you want your widget to respond to.
const sentenceContainsWord = (string, match, single = true) => {
    if (!string || !match || string.length === 0 || match.length === 0) {
        return false;
    }

    string = string.toLowerCase();
    if (single) {
        const split = string.split(' ');
        return Array.isArray(match)
            ? split.some(word => match.includes(word))
            : split.includes(match);
    }
    return Array.isArray(match)
        ? match.some(toMatch => string.includes(toMatch))
        : string.includes(match);
};

// Add the commands you want your widget to respond to to this array.
const commandWords = [
    'tell me a new joke',
    'new joke',
];

module.exports = {
    sentenceContainsWord,
    commandWords
};