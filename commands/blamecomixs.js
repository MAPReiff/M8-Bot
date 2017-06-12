exports.run = (client, message) => {
  message.delete();
  var request = require("request");
  request("https://comixsyt.space/blamecomixs/comixsblamecount.php", function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var count = body;
      message.channel.send("Wow, Comixs has been blamed **" + count + "** times! Thanks " + message.author + "!");
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["blame comixs"],
  permLevel: 0
};

exports.help = {
  name: 'blamecomixs',
  description: 'Used whenever ComixsYT does something stupid and must be blamed!',
  usage: '!blamecomixs'
};
