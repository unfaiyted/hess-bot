import {MessageAttachment} from "discord.js";

// List of commands in the bot.
import {randomFailChance} from "./numbers.js";
import {randomItemFromArray} from "./utils.js";
import {CONFIRM, DENY} from "./responses/generic.js";
import {MOVIES} from "./responses/movies.js";
import {_FACE_} from "./constants/app.constants.js";
import {MEMES} from "./responses/memes.js";


export const COMMANDS = {
    ...MOVIES,
    ...MEMES,
  puns: {
      triggers: [
          /pun/,
      ],
      func: (msg) => {
          let emoji =  msg.guild.emojis.cache.find(emoji => emoji.name === 'hessPuns');
          msg.react(emoji);
          msg.reply(`${_FACE_} why must you hurt me`);
      }
  },
  sad: {
        triggers: [
            /sad|unhappy|worthless|life sucks/
        ],
        func: async (msg) => {

            const attachment = new MessageAttachment('./images/happy.jpg');
            // Send the attachment in the message channel with a content
            msg.channel.send(``, attachment);
            msg.reply("HAPPY AND FULFILLED")
        }
    }
};


/**
 * Change a msg will just outright fail,
 * hessBot just doesnt like doing stuff, hes kinda lazy sometimes
 * @param msg
 * @param func
 */
export const failChance = (msg, func) => {

    if (randomFailChance(.25)) {
        msg.reply(randomItemFromArray(DENY))
    } else {
        func(msg);
    }
};
