import {TOKEN} from "./utils/constants/secret.js";
import Discord from "discord.js";
import {COMMANDS, failChance} from "./utils/commands.js";
import {RANDOM} from "./utils/responses/random.js";
import {randomItemFromArray} from "./utils/utils.js";
import {CONFIRM} from "./utils/responses/generic.js";

const client = new Discord.Client();
const commandKeys = Object.keys(COMMANDS);
const randomKeys = Object.keys(RANDOM);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // console all commands
    for (const key of commandKeys) {
        console.log(key);
        console.log("triggers: ",COMMANDS[key].triggers);
    }

});


client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(` ${msg.reply(randomItemFromArray(CONFIRM))} It's ${member}`);
});


client.on('message', msg => {

    if (msg.author.bot) return;

    if (msg.content === 'ping') {
        msg.reply('pong');
    }

    for (const key of commandKeys) {
        if (COMMANDS[key].triggers.some(str => str.test(msg.content))) {
            failChance(msg, COMMANDS[key].func)
        }
    }

    for (const key of randomKeys) {
        if (RANDOM[key].regexMatch.test(msg.content)) {
            msg.reply(randomItemFromArray(RANDOM[key].responses))
        }
    }



});



client.login(TOKEN);
