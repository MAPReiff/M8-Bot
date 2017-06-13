exports.run = (client, message) => {
  const Discord = require("discord.js");
  message.delete();
  if (message.guild != null) {
    if (message.guild.iconURL = null) {
      var iconURL = "https://newagesoldier.com/wp-content/uploads/2016/12/masbot.png";
    } else {
      var iconURL = message.guild.iconURL;
    }
    const serverEmbed = new Discord.RichEmbed()
      .setTitle(message.guild.name)
      .setColor(0x9900FF)
      .setFooter("Sent via M8 Bot", "http://i.imgur.com/nXvRJXM.png")
      .setThumbnail(iconURL)
      .setTimestamp()
      .addField("Server ID", message.guild.id, true)
      .addField("Region", message.guild.region, true)
      .addField("Owner", message.guild.owner, true)
      .addField("Members", message.guild.memberCount, true)
      .addField("Roles", message.guild.roles.size, true)
      .addField("Channels", message.guild.channels.size, true)
      .addField("Created At", message.guild.createdAt)
      .addField("Joined Server At", message.guild.joinedAt)
    message.channel.send({
      embed: serverEmbed
    });
  } else {
    message.reply("You can't use that command in a DM!")
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'server',
  description: 'Get info about the current discord server.',
  usage: '!server'
};
