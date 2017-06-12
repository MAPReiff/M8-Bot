exports.run = (client, message) => {
  message.delete();
  var request = require("request");
  request("https://comixsyt.space/blamecomixs/unblamecomixs.php", function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var count = body;
      message.channel.send("Wow, thanks for unblaming Comixs. The current blame count is now only **" + count + "**. You are truly a good person " + message.author + "!");
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["unblame comixs", "un blame comixs"],
  permLevel: 0
};

exports.help = {
  name: 'unblamecomixs',
  description: 'Used whenever ComixsYT does something good and must be unblamed!',
  usage: '!unblamecomixs'
};
