exports.run = (client, message) => {
  message.delete();
  message.channel.send(`${message.author.toString()} | You can invite me to your server by visiting http://invitem8.comixsyt.space`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'invite',
  description: 'Displays the bot\'s invite link.',
  usage: 'invite'
};
