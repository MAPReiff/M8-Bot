var sourceFile = require('../m8botdev.js');
const Discord = require('discord.js');

exports.run = (client, message) => {
  message.delete();
  const bugEmbed = new Discord.RichEmbed()
    .setColor(0x9900FF)
    .setTitle("M8 Bot Bug Report")
    .setDescription("I am so sorry that you are having an issue with me!\nThere are a few ways to submit issues.")
    .addField("Github", "https://goo.gl/DVEsVs", true)
    .addField("Twitter", "https://goo.gl/kG3kRR", true)
    .addField("My Discord", sourceFile.officialDiscord, true)
    .setThumbnail(sourceFile.botLogo)
    .setFooter("Sent via M8 Bot", sourceFile.botLogo)
    .setTimestamp()
  message.channel.send({
    embed: bugEmbed
  })};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'm8bug',
  description: 'Returns a link to report bugs.',
  usage: '!m8bug'
};
