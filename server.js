import Discord, {MessageAttachment} from "discord.js";
import low from  'lowdb';
import FileSync from 'lowdb/adapters/FileSync.js';

import {TOKEN} from "./utils/constants/secret.js";
import {COMMANDS, failChance} from "./utils/commands.js";
import {RANDOM} from "./utils/responses/random.js";
import {randomItemFromArray, isURLImage} from "./utils/utils.js";
import {CONFIRM} from "./utils/responses/generic.js"
import {MENTIONS} from "./utils/responses/mentions.js";


const adapter = new FileSync('db.json');
global.db = low(adapter);

db.defaults({
    movies: [],
    events: [],
    polls: [],
    previousMemes: []
}).write();

global.client = new Discord.Client();
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

    // msg.guild.members.fetch().then(members => {
    //     //console.log(members);
    //     //console.log("woop");
    //     for(const member of members) {
    //         console.log(`
    //         {
    //         username: \"${member[1].user.username}\",
    //         responses: []
    //         },
    //         `)
    //     }
    // });

    console.log(msg.content);


    if (msg.mentions.has(client.user)) {
       // console.log(msg.mentions);
        let responded = false;
        for(const mention of MENTIONS) {
            //console.log(mention, msg.author.username,mention.username);
            if(mention.username === msg.author.username) {

                failChance(msg, (msg) => {
                    msg.reply(randomItemFromArray(mention.responses));
                }, true);

                responded = true;
            }
        }

        if(responded === false)  msg.reply('<3');

    }

    //console.log(msg);


    for (const key of commandKeys) {
        if (COMMANDS[key].triggers.some(str => str.test(msg.content.toLowerCase()))) {
            failChance(msg, COMMANDS[key].func)
        }
    }

    for (const key of randomKeys) {
        if (RANDOM[key].regexMatch.test(msg.content.toLowerCase())) {

            const response = randomItemFromArray(RANDOM[key].responses);

            if (Array.isArray(response)) {
                for(const res of response) {
                    createMessage(res, msg);
                }
            } else {
                createMessage(response, msg)
            }

        }
    }

});


client.on("messageReactionAdd", react => {
   if (react.author.bot) return;


   console.log(react.emoji.name)

});


function createMessage(response, msg) {
    if(isURLImage(response)) {
        const attachment = new MessageAttachment(response);
        // Send the attachment in the message channel with a content
        msg.channel.send(``, attachment);
    } else {
        msg.reply(response);
    }
}


client.login(TOKEN);
