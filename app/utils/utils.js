const { VALID_IMG_EXT } = require('./constants/app.constants.js');

const randomItemFromArray = (array) => array[Math.floor(Math.random() * (array.length))];

/**
 * Checks if the url is to a valid image type.
 * Image type is specified in app.constants.js
 * @param url
 * @returns {boolean}
 */
const isURLImage = (url) => {
  const urlSplit = url.split('/');
  const fileName = urlSplit[urlSplit.length - 1];
  const extension = fileName.split('.');

  return VALID_IMG_EXT.some((ext) => ext === extension[1]);
};

/**
 * Returns the user from a mention string
 * @param mention
 * @returns {User}
 */
const getUserFromMention = (mention) => {
  if (!mention) return;

  if (mention.startsWith('<@') && mention.endsWith('>')) {
    mention = mention.slice(2, -1);

    if (mention.startsWith('!')) {
      mention = mention.slice(1);
    }

    return client.users.cache.get(mention);
  }
};


/**
 * Cleans up the string for each trigger in a given set of triggers.
 * @param triggers
 * @param string
 * @returns {Array}
 */
const resultPerTrigger = (triggers, string) => {
  const results = [];

  for (const trigger of triggers) {
    results.push({
      string: string.replace(trigger, '').trim(),
      hasMatch: (trigger.test(string)),
    });
  }

  return results;
};


const getCustomEmoji = (name, msg) => msg.guild.emojis.cache.find((emoji) => emoji.name === 'hessPuns');




const getChannelById = (id) => client.channels.cache.get(id);


const sendMsgToChannel = (msg, content) => getChannelById(msg.channel.id).send(content);


module.exports = {
  getCustomEmoji,
  getChannelById,
  sendMsgToChannel,
  resultPerTrigger,
  getUserFromMention,
  isURLImage,
  randomItemFromArray,
};
