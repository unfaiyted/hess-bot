import {MessageAttachment} from "discord.js";

// List of commands in the bot.
import {randomFailChance} from "./numbers.js";
import {randomItemFromArray, getPictureFromReddit} from "./utils.js";
import {CONFIRM, DENY} from "./responses/generic.js";
import {MOVIES} from "./responses/movies.js";
import {_FACE_} from "./constants/app.constants.js";


export const COMMANDS = {
    ...MOVIES,
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
  memes: {
      triggers: [
          /meme/
      ],
      func: async (msg) => {
          msg.reply(randomItemFromArray(CONFIRM));
          getMemes(msg);
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
 * Trys to find a meme, if it fails it will retry 5 times before failing finally.
 * @param msg
 * @param retry
 * @returns {Promise<void>}
 */
export async function getMemes(msg, retry = 0)  {

    try {
        const picture =  await getPictureFromReddit();

        console.log(picture);

        if(picture.length > 0) {
            msg.reply(randomItemFromArray(picture).link);
        } else {
            msg.reply("Memes suck today. Try again.")
        }

    } catch (e) {
        if(retry < 5) {
            getMemes(msg,retry+1);
        } else {
            msg.reply("Fuck if I know, shits broke.");
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
        console.log("has random fail",);
        msg.reply(randomItemFromArray(DENY))
    } else {
        console.log(func, typeof func);
        func(msg);
    }
}
