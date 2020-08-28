import Discord, {MessageAttachment} from "discord.js";
import moment from 'moment';
import {TOKEN} from "./utils/constants/secret.js";
import {COMMANDS, failChance} from "./utils/commands.js";
import {RANDOM} from "./utils/responses/random.js";
import {FRIENDS} from "./utils/constants/friends.js";
import {randomItemFromArray, isURLImage} from "./utils/utils.js";
import {CONFIRM} from "./utils/responses/generic.js"
import {MENTIONS} from "./utils/responses/mentions.js";
import {sendBirthdayReacts, bDayCompare} from "./utils/responses/birthday.js";
import {connectToDatabase} from "./utils/database.js";

// global.db = connectToDatabase();
global.client = new Discord.Client();

const commandKeys = Object.keys(COMMANDS);
const randomKeys = Object.keys(RANDOM);
const friendKeys =  Object.keys(FRIENDS);



connectToDatabase().then((db) => {


    global.db = db;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // console all commands
    for (const key of commandKeys) {
        console.log(key);
        console.log("triggers: ",COMMANDS[key].triggers);
    }


    const user = client.users.cache.find(user => user.username === 'MEATY TONES');


    let i = 0;
    const interval = setInterval(() => {

        const BDay = [
            "Its our Birthday !!! OUR BIRTHDAY!!!",
            "We're the very best of people",
            "I'm definitely a person!!! NOT A bot!",
            "its my birthday!!!!!!",
            "aRENT YOU SO HAPPPPPY",
            "dane loves us so much!!!!",
            "WE HAVE THE BEST BIRTHDAYYYYYYY EVAAAHHHHHHHH",
            "Awwwwww Yissss",
            "HAPPY BIRTHDAYYYY TO USSSSS!"

        ];

        if(moment().isSame('2020-08-06T01:00',"hour")) {
            console.log("thats today!")

            user.send(BDay[i]);

            if (i  === 8) {
             clearInterval(interval);
            };

            i++;

        } else {
            const m = moment("2020-08-06T01:00").diff(moment(),"minutes");
           // console.log("not yet in ", m);

        }


    },2000)

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




    for (const key of friendKeys) {
        const friend = FRIENDS[key];
       if(friend.username === msg.author.username) {

           const bday = bDayCompare(friend.birthday);

           if(moment().isSame(bday,"day")) {
               console.log("bday is today");
               sendBirthdayReacts(msg);
           } else {
               const m = moment(bday).diff(moment(),"days");
               console.log("not yet in ", m);
           }
       }
    }

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
   //if (react.author.bot) return;
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

TOKEN.then((result) => {
    client.login(result);
});

});
