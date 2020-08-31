const MessageEmbed = require("discord.js").MessageEmbed;

exports.POLLS = {
    createPoll: {
        triggers: [
            /add poll|add new poll/
        ],
        help: "",
        func: async (msg) => {

            const STEPS = [
                "Gimme dat poll title!",
                "How many fukin questions you want?",
                "Tell me your shitty first option",
                "Tell me your awful second option",
                "Tell me your boring third option",
                "Tell me your annoying fourth option",
                "Tell me your fifth terrible option",
                "We finally done? Good, fuck off"
            ];

            const data  = [
                msg.author.username,
                msg.createdTimestamp,
                ];

            questionFlow(msg, data, STEPS)

        }
    },
    deletePoll: {
        triggers: [
            /delete poll/
        ],
        help: "",
        func: (msg) => {}
    }
};


module.exports = async function questionFlow(msg, data, STEPS, currentStep = 0, botMsg = null) {

    if(botMsg === null) {
         botMsg = await msg.channel.send(syncPollDetails(data, STEPS[currentStep]));
     } else {
         botMsg.edit(syncPollDetails(data, STEPS[currentStep]));
     }

    msg.channel.awaitMessages(m => m.author.id === msg.author.id,
        {max: 1, time: 30000}).then(async collected => {
            const step = currentStep + 1;

            collected.first().delete({timeout: 100});

            if(!data[3] || (2 + parseInt(data[3])) > step) {
                await questionFlow(msg, data, STEPS, step, botMsg);
            } else {

                botMsg.edit(syncPollDetails(data, STEPS[STEPS.length-1]));

                // Prevent reposting
                db.get('polls')
                    .push({
                        id: botMsg.id,
                        channel: botMsg.channel,
                        title: data[2],
                        author: data[0],
                        timestamp: data[1],
                        totalOptions: data[3],
                        active: true,
                        deleted: false,
                        options: [
                            (data[4] && {
                                text: data[4],
                                votes: 0,
                            }),
                            (data[5] && {
                                text: data[5],
                                votes: 0,
                            }),
                            (data[6] && {
                                text: data[6],
                                votes: 0,
                            }),
                            (data[7] && {
                                text: data[7],
                                votes: 0,
                            }),
                            (data[8] && {
                                text: data[8],
                                votes: 0,
                            }),
                        ]
                    })
                    .write();

                botMsg.react("1⃣");
                if(parseInt(data[3]) > 1) botMsg.react("2⃣");
                if(parseInt(data[3]) > 2) botMsg.react("3⃣");
                if(parseInt(data[3]) > 3) botMsg.react("4⃣");
                if(parseInt(data[3]) > 4) botMsg.react("5⃣");
                botMsg.react("❌");
                botMsg.react("✅");

            }

    }).catch((e) => {
        log.error(e);
      botMsg.edit('Dude you\'re slow as hell, or I crashed hard. Laters');
    });
}

const syncPollDetails = (data, currentStep) => {

    const mov = `${(data[4]) ? "\n1⃣ " + data[4] : ""}
    ${(data[5]) ? "\n2⃣ " + data[5] : ""}
    ${(data[6]) ? "\n3⃣ " + data[6] : ""}
    ${(data[7]) ? "\n4⃣ " + data[7] : ""}
    ${(data[8]) ? "\n5⃣ " + data[8] : ""}`;

    return new MessageEmbed()
        .setColor('#005f20')
        .setTitle(`${currentStep}`)
        .addFields(
            { name: `Poll - ${(data[2]) ? data[2] : "Not yet Added"}`,
                value: `${mov} x` },
        )
        .setTimestamp()
        .setFooter('HessBot the best Bot',  client.user.displayAvatarURL());
};


