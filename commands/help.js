exports.run = (client, message) => {
  message.delete();
  message.channel.send(`Hello ${message.author.toString()}, I'm **M8 Bot!** if you would like to see my commands type \`!cmds\` for a list.`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'help',
  description: 'Displays helpful information.',
  usage: 'help'
};
