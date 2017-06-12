exports.run = (client, message) => {
  message.delete();
  if (message.content.startsWith("!define")) {
    var term = message.content.replace("!define ", "");
  }
  if (message.content.startsWith("!urban")) {
    var term = message.content.replace("!urban ", "");
  }
  if (message.content.startsWith("!def")) {
    var term = message.content.replace("!def ", "");
  }
  var request = require("request");
  request("http://api.scorpstuff.com/urbandictionary.php?term=" + term, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var def = body;
      message.channel.send(def);
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['define', 'def'],
  permLevel: 0
};

exports.help = {
  name: 'urban',
  description: 'Get the urban definition of a word.',
  usage: '!urban ___'
};
