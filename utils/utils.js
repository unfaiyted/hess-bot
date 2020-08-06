import fetch from "node-fetch"
import {MEMES_SUBS, VALID_IMG_EXT} from "./constants/app.constants.js";

export const randomItemFromArray = (array) => {
 return array[Math.floor(Math.random()*(array.length))]
};

export const isURLImage = (url) => {

    const urlSplit = url.split("/");
    const fileName = urlSplit[urlSplit.length-1];
    const extension = fileName.split(".");

    return VALID_IMG_EXT.some(ext => ext === extension[1]);
};


export const getUserFromMention = (mention) => {
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
export const resultPerTrigger = (triggers, string) => {

    let results = [];

    for(const trigger of triggers) {
        results.push({
            string: string.replace(trigger,"").trim(),
            hasMatch: (trigger.test(string)),
        });
    }

    return results;

};


export const getCustomEmoji = (name, msg) => {
    return msg.guild.emojis.cache.find(emoji => emoji.name === 'hessPuns');
};
