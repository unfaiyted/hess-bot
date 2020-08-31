const MessageAttachment = Discord.MessageAttachment;
const {randomItemFromArray, isURLImage}  = require("../utils/utils.js");
const randomFailChance = require("../utils/numbers.js").randomFailChance;
const {FAIL_CHANCE} = require("../utils/constants/app.constants");
const {DENY} = require("../responses/generic.js");

/**
 * Change a msg will just outright fail,
 * hessBot just doesnt like doing stuff, hes kinda lazy sometimes
 * @param msg - inciting msg
 * @param func - callback function
 * @param noResponseOnFail bool - wont send anything when fails
 */
exports.failChance = (msg, func, noResponseOnFail = false) => {

    if (randomFailChance(FAIL_CHANCE)) {
        if(noResponseOnFail === false) msg.reply(randomItemFromArray(DENY))
    } else {
        func(msg);
    }
};


/**
 * Checks what kind of response it should send and if its a URL to an image
 * It will attach that image directly
 * @param response - intended response
 * @param msg - msg object
 */
exports.createMessage = (response, msg) => {
    if (isURLImage(response)) {
        const attachment = new MessageAttachment(response);
        // Send the attachment in the message channel with a content
        msg.channel.send(``, attachment);
    } else {
        msg.reply(response);
    }
}

