exports.run = (client, message) => {
  message.delete();
  var request = require("request");
  request("http://www.murfguy.com/puns.php", function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var pun = body;
      message.channel.send(pun);
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['pun'],
  permLevel: 0
};

exports.help = {
  name: 'dadjoke',
  description: 'Sends a funny pun courtesy of murfGUY\'s dadjoke database.',
  usage: '!dadjoke'
};
