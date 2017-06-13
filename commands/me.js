exports.run = (client, message) => {
  const Discord = require("discord.js");
  message.delete();
  const meEmbed = new Discord.RichEmbed()
    .setTitle(message.author.username)
    .setColor(0x9900FF)
    .setFooter("Sent via M8 Bot", "http://i.imgur.com/nXvRJXM.png")
    .setThumbnail(message.author.displayAvatarURL)
    .setTimestamp()
    .addField("ID", message.author.id, true)
    .addField("Bot", message.author.bot, true)
    .addField("Registered", message.author.createdAt)
  message.channel.send({
    embed: meEmbed
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'me',
  description: 'Get info about your discord account.',
  usage: '!me'
};
