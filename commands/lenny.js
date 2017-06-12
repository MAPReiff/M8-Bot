exports.run = (client, message) => {
  message.delete();
  message.channel.send("( ͡° ͜ʖ ͡°)")
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'lenny',
  description: '( ͡° ͜ʖ ͡°)',
  usage: '!lenny'
};
