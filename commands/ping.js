exports.run = (client, message) => {
  message.delete();
  message.channel.send('Ping?')
    .then(msg => {
      msg.edit(`Pong! ${msg.createdTimestamp - message.createdTimestamp}ms`);
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'ping',
  description: 'Ping command to test the bot.',
  usage: 'ping'
};
