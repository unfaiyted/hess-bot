const { MessageEmbed } = require('discord.js');


const printList = (list) => {
  let string = '';
  let i = 1;
  for (const item of list) {
    string += `${i}. ${item}\n`;
    i++;
  }
  return string;
};

/**
 * Default Embed Settings for HessBot, allows for dynamic Embed creation
 * with less code.
 * @param title
 * @param url
 * @param author
 * @param image
 * @param list
 * @param listTitle
 * @param color
 * @returns {module:"discord.js".MessageEmbed}
 * @constructor
 */
const DefaultEmbed = ({
  title, url, author, image, list,
  listTitle,
  color,
}) => {
  const Embed = new MessageEmbed()
    .setColor((!color) ? '#005f20' : color)
    .setTimestamp()
    .setFooter('HessBot the bess Bot', client.user.displayAvatarURL());

  if (title) Embed.setTitle(title);
  if (url) Embed.setURL(url);
  if (image) Embed.setImage(image);
  // if().setAuthor(chosen.sub, client.user.displayAvatarURL(), `https://reddit.com/${chosen.sub}`)

  if (list) {
    Embed.addFields({
      name: (!listTitle) ? 'List' : listTitle,
      value: printList(list),
    });
  }

  return Embed;
};





module.exports = {
  DefaultEmbed,
};
