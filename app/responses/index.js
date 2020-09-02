const { sendBirthdayReactsToUser } = require('./birthday.js');
const { sendMentionResponse } = require('./mentions.js');
const { checkSentiment } = require('./sentiment-analysis.js');

module.exports = {
  onMessage: (msg) => {
    sendBirthdayReactsToUser(msg);
    sendMentionResponse(msg);
    checkSentiment(msg);
  },
  onReact: (react) => {
    log.trace(react.emoji.name);
  },
};
