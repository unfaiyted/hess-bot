const { MessageAttachment } = require('discord.js');
const { failChance } = require('../utils/message.js');
const { _FACE_ } = require('../utils/constants/app.constants.js');
const { MOVIES } = require('./movies.js');
const { MEMES } = require('./memes.js');
const { POLLS } = require('./polls.js');
const pjson = require('../../package.json');

const COMMANDS = {
  ...MOVIES,
  ...MEMES,
  ...POLLS,
  puns: {
    triggers: [
      /pun/,
    ],
    func: (msg) => {
      const emoji = msg.guild.emojis.cache.find((emoji) => emoji.name === 'hessPuns');
      msg.react(emoji);
      msg.reply(`${_FACE_} why must you hurt me`);
    },
  },
  sad: {
    triggers: [
      /sad|unhappy|worthless|life sucks/,
    ],
    func: async (msg) => {
      const attachment = new MessageAttachment('./images/happy.jpg');
      // Send the attachment in the message channel with a content
      msg.channel.send('', attachment);
      msg.reply('HAPPY AND FULFILLED');
    },
  },
  potassium: {
    triggers: [/k/i],
    func: async (msg) => {
      if (msg.content.trim().length === 1) msg.reply('Well, Potassium to you too');
    },
  },
  version: {
    triggers: [/-version/i],
    func: (msg) => {
      msg.reply(`I'm v${pjson.version}, what you think you're better than me?`);
    },
  },

};
const commandKeys = Object.keys(COMMANDS);

module.exports = {
  onMessage: (msg) => {
    for (const key of commandKeys) {
      if (COMMANDS[key].triggers.some((str) => str.test(msg.content.toLowerCase()))) {
        failChance(msg, COMMANDS[key].func);
      }
    }
  },
  log: () => {
    for (const key of commandKeys) {
      log.info(`[${key}] triggers:`, COMMANDS[key].triggers);
    }
  },
};
