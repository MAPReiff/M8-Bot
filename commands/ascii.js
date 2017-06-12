exports.run = (client, message) => {
  message.delete();
  var input = message.content.replace("!ascii ", "");
  var request = require("request");
  request("https://artii.herokuapp.com/make?text=" + input, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var ascii = body;
      message.channel.send("```\n " + message.author.username + " has requested \"" + input + "\" in ASCII from! \n" + ascii + "```");
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'ascii',
  description: 'Gets whatever you typed after !ascii and makes it into ASCII art.',
  usage: '!ascii ___'
};
