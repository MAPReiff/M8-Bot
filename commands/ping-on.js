exports.run = (client, message) => {
  message.delete();
  if (message.author.id == message.guild.ownerID || message.member.hasPermission("ADMINISTRATOR")) {
    message.channel.overwritePermissions("278362996349075456", {
      "MENTION_EVERYONE": true,
    })
    message.reply("the @-here ping has been enabled in this channel.")
  } else {
    message.reply("you do not have permission to run this command!")
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'ping-on',
  description: 'Allows a server owner/admin to decide whether or not M8 Bot can use @here in that channel. Default is on.',
  usage: '!ping-on'
};
