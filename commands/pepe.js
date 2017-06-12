exports.run = (client, message) => {
  message.delete();
  var request = require("request");
  request("http://comixsyt.space/ascii/pepe.txt", function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var pepeASCII = (body);
      message.channel.send("```\nSent by " + message.author.username + ".\n" + pepeASCII + "\n```");
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
  name: 'pepe',
  description: 'Who doesn’t love Pepe?',
  usage: '!pepe'
};
