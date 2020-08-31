const MessageEmbed = require("discord.js").MessageEmbed;


const Embed = () => {

    return new MessageEmbed()
        .setColor('#005f20')
        .setAuthor(chosen.sub, client.user.displayAvatarURL(), 'https://reddit.com/' + chosen.sub)
        .setTitle(chosen.title)
        .setURL('https://reddit.com' + chosen.redditLink)
        .setImage(chosen.link)
        .setTimestamp()
        .setFooter('HessBot the best Bot',  client.user.displayAvatarURL());
}
