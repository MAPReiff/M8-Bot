exports.run = (client, message) => {
  message.delete();
  var request = require("request");
  request("http://comixsyt.space/ascii/tank.txt", function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var tankASCII = (body);
      message.channel.send("```\nSent by " + message.author.username + ".\n" + tankASCII + "\n```");
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
  name: 'tank',
  description: 'GTFO of my way I got a fucking tank!',
  usage: '!tank'
};
