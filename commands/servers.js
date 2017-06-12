exports.run = (client, message) => {
  message.delete();
  message.channel.send(`${message.author.toString()} | The servers I am in are:\n\`\`\`${client.guilds.map(g => g.name).join(', ')}\`\`\``);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'servers',
  description: 'Displays how many servers the bot is on.',
  usage: 'servers'
};
