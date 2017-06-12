exports.run = (client, message) => {
  message.delete();
  var request = require("request");
  request("http://comixsyt.space/ascii/mFinger.txt", function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var mFingerASCII = (body);
      message.channel.send("```\nSent by " + message.author.username + ".\n" + mFingerASCII + "\n```");
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
  name: 'mfinger',
  description: 'Allows you to give the finger that is located in the middle of our appendages to others.',
  usage: '!mfinger'
};
