const {sendBirthdayReactsToUser} = require("./birthday.js");
const {sendMentionResponse} = require("./mentions.js");

module.exports = {
    onMessage: (msg) => {
        sendBirthdayReactsToUser(msg);
        sendMentionResponse(msg);
    },
    onReact: (react) => {
        log.trace(react.emoji.name)
    }
}
