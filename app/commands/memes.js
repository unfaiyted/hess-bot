const randomItemFromArray = require("../utils/utils.js").randomItemFromArray;
const getPictureFromReddit = require("../utils/constants/api.js").getPictureFromReddit;
const CONFIRM = require("../responses/generic.js").CONFIRM;
const MessageEmbed = require("discord.js").MessageEmbed;

exports.MEMES = {
    memes: {
        triggers: [
            /meme/
        ],
        help: "Command sends list of movies in DB",
        func: async (msg) => {
            msg.reply(randomItemFromArray(CONFIRM));
            await getMemes(msg);
        }
    },
    aww: {
        triggers: [
            /aww/
        ],
        help: "Command sends list of movies in DB",
        func: async (msg) => {
            msg.reply(randomItemFromArray(CONFIRM));
            await getMemes(msg, "aww");
        }
    },
};


/**
 * Try's to find a meme, if it fails it will retry 5 times before failing finally.
 * @param msg
 * @param type
 * @param retry
 * @param maxRetry
 * @returns {Promise<void>}
 */
const getMemes = async (msg, type = "meme", retry = 0, maxRetry = 5) => {

    try {
        const picture =  await getPictureFromReddit(type);

        if(picture.length > 0) {

            const chosen = randomItemFromArray(picture);

            const prev = await db.collection('previousMemes').find({ link: chosen.link }).toArray();

            log.info(prev);

            if(prev.length === 0) {

                // Prevent reposting
                db.collection('previousMemes')
                    .insert(chosen)

                const embed = new MessageEmbed()
                    .setColor('#005f20')
                    .setAuthor(chosen.sub, client.user.displayAvatarURL(), 'https://reddit.com/' + chosen.sub)
                    .setTitle(chosen.title)
                    .setURL('https://reddit.com' + chosen.redditLink)
                    .setImage(chosen.link)
                    .setTimestamp()
                    .setFooter('HessBot the bess Bot',  client.user.displayAvatarURL());

                msg.channel.send(embed);

            } else {
                msg.reply("Awwwww Shizzz, I posted that before. Lets see...");
                await getMemes(msg,retry+1);
            }

        } else {
            msg.reply("Memes suck today. Try again.")
        }

    } catch (e) {
        log.error(e)
        if(retry < maxRetry) {
            await getMemes(msg,retry+1);
        } else {
            msg.reply("Fuck if I know, shits broke.");
        }
    }

}
