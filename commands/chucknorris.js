exports.run = (client, message) => {
  message.delete();
  var request = require("request");
  request("https://api.chucknorris.io/jokes/random", function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      message.channel.send("**Chuck Norris Fact:** " + info.value);
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['cn','chuck'],
  permLevel: 0
};

exports.help = {
  name: 'chucknorris',
  description: 'Pulls a random Chun Norris fact.',
  usage: '!chucknorris'
};
