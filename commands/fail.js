exports.run = (client, message) => {
  message.delete();
  var request = require("request");
  request("http://comixsyt.space/ascii/fail.txt", function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var failASCII = (body);
      message.channel.send("```\nSent by " + message.author.username + ".\n" + failASCII + "\n```");
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
  name: 'fail',
  description: 'For when someone seriously fails.',
  usage: '!fail'
};
