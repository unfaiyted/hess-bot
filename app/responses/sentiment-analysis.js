const fetch = require('node-fetch');
const KEY = require('../utils/constants/secret.js').MONKEY_LEARN_API;

global.Headers = fetch.Headers;

const modelId = 'cl_pi3C7JiL';
const API = `https://api.monkeylearn.com/v3/classifiers/${modelId}/classify/`;

// TODO: Add ability to store analysis score, and avg them.
// TODO: Get users sentiment score and see how positive neutral or negative someone is.

/**
 * Returns the sentiment analysis of a specific message.
 * @param msg
 */
exports.checkSentiment = (msg) => {
  const collection = db.collection('userSentiment');
  log.silly(`Checking sentiment of: ${msg.content}`);
  KEY.then((result) => {
    log.silly(result, 'key');
    fetch(API, {
      method: 'post',
      headers: new Headers({
        Authorization: `Token ${result}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        data: [msg.content],
      }),
    }).then((r) => r.json())
      .then((r) => {
        log.silly(r, 'returned');
        log.silly(r[0].classifications);

        const { tag_name: name, confidence } = r[0].classifications[0];

        collection.insertOne({
          user: msg.author,
          text: msg.content,
          sentiment: name,
          confidence,
        });

        // msg.reply(`${name}, ${parseFloat(confidence) * 100}%`);
      });
  });
};
