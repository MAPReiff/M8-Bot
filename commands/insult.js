const insult = require('../insultgen.js');
exports.run = (client, message) => {
  message.delete();
  if (!message.mentions.users.first()) {
    message.reply('You need to **@mention** someone to insult them.')
        .then(response => response.delete(9000).catch(error => console.log(error.stack)))
        .catch(error => console.log(error.stack));
    } else {
      message.channel.send(message.mentions.users.first() + ', You know what? You\'re nothing but ' +
        insult.start[
          Math.floor(Math.random() * insult.start.length)
        ] + ' ' +
        insult.middle[
          Math.floor(Math.random() * insult.middle.length)
        ] + ' ' +
        insult.end[
          Math.floor(Math.random() * insult.end.length)
        ] + '.').catch(error => console.log(error.stack));
    }
  };

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'insult',
  description: 'Just mention a user and watch the insult do everything else.',
  usage: 'insult'
};
