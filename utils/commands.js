import {MessageAttachment} from "discord.js";

// List of commands in the bot.
import {randomFailChance} from "./numbers.js";
import {randomItemFromArray, getPictureFromReddit} from "./utils.js";
import {CONFIRM, DENY} from "./responses/generic.js";
import {MOVIES} from "./responses/movies.js";


export const COMMANDS = {
    ...MOVIES,

  puns: {
      triggers: [
          /pun/,
      ],
      func: (msg) => {
          console.log("-______________________- why must you hurt me");
          msg.reply('-______________________- why must you hurt me');
      }
  },
  memes: {
      triggers: [
          /meme/
      ],
      func: async (msg) => {

          msg.reply(randomItemFromArray(CONFIRM));

          try {
              const picture =  await getPictureFromReddit();

              console.log(picture);

              if(picture.length > 0) {
                  msg.reply(randomItemFromArray(picture).link);
              } else {
                  msg.reply("Memes suck today. Try again.")
              }

          } catch (e) {
              msg.reply("Fuck if I know. Shit failed")
          }

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


export const failChance = (msg, func) => {

    if (randomFailChance(.25)) {
        console.log("has random fail",);
        msg.reply(randomItemFromArray(DENY))
    } else {
        console.log(func, typeof func);
        func(msg);
    }
}
