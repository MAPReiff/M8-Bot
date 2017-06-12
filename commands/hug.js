exports.run = (client, message) => {
  message.delete();
  message.delete(1000);
  if (message.content.startsWith("!hugs ")) {
    var who = message.content.replace("!hugs ", "")
  }
  if (message.content.startsWith("!hug ")) {
    var who = message.content.replace("!hug ", "")
  }
  message.channel.send(message.author + " gave " + who + " a nice, big, hug!");
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['hugs'],
  permLevel: 0
};

exports.help = {
  name: 'hug',
  description: 'Wanna give someone a hug? Do it then!',
  usage: '!hug ___'
};
