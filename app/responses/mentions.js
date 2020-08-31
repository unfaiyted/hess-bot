const {randomItemFromArray}  = require("../utils/utils.js");
const {failChance} = require("../utils/message.js");

//TODO: Refactor to use friends.js lookup
exports.MENTIONS = [
    {
        username: "Tesmen",
        responses: [
            "Who the fuck told you that you were people?",
            "What the CheeseHead fuck do you want now?",
            "Get yo sexy ass over here!  M M M M P F"
        ]
    },
    {
        username: "Richard C",
        responses: [
            "Richard!  What are we cooking!? :D",
        ]
    },
    {
        username: "Faiyt",
        responses: [
            "<3 You gave me life!",
            "I live only to slake your bloodthirst, father"
        ]
    },
    {
        username: "row.rave",
        responses: [
         "J'Alyssa Dos Santos De La Rocha Nina Pinta Santa Maria Mountain Dew Taco Town Gutierrez Picadillo Arroz Con Leche Manzanita Del Sol Por Favor Ayudame Pirque No Quiero Vivir Por Real Chinga Tu Pinche Madre Por Qué No Vas a Matame Pinche Baboso Cabrón De La Mierda Pendejo Whorenandez"
        ]
    },
    {
        username: "dalton",
        responses: [
            "#ART"
        ]
    },
    {
        username: "EnderValentine",
        responses: [
            "Dan the Man"
        ]
    },
    {
        username: "Tukuko Isolde",
        responses: [

        ]
    },
    {
        username: "Faustus Mau",
        responses: [
            "Ugh, fucking Watson"
        ]
    },
    {
        username: "jsngov",
        responses: [
            "There are two types of people one who can extrapolate from missing data and? "
        ]
    },
    {
        username: "FaiytBot",
        responses: [
            "I'm the only bot thats supposed to be here! Faker!"
        ]
    },
    {
        username: "MEATY TONES",
        responses: [
            "You're not my real me!"
        ]
    },
    {
        username: "Zombino",
        responses: []
    },
    {
        username: "Quirx",
        responses: []
    },

];

exports.sendMentionResponse = (msg) => {
    if (msg.mentions.has(client.user)) {
        let responded = false;
        for (const mention of this.MENTIONS) {
            //console.log(mention, msg.author.username,mention.username);
            if (mention.username === msg.author.username) {
                failChance(msg, (msg) => {
                    msg.reply(randomItemFromArray(mention.responses));
                }, true);
                responded = true;
            }
        }
        // In case user is not found
        if (responded === false) msg.reply('<3');
    }
}
