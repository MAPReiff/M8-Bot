exports.run = (client, message) => {
  message.delete();
  var userDir = __dirname.replace("commands", "users")

  const streamerFolder = userDir;
  const fs = require('fs');
  var chatID = message.channel.id;
  fs.readdir(streamerFolder, (err, files) => {
    files.forEach(file => {
      var files = file
    });
    var fileCount = files.length
    var myStreamers = "Current Streamer List:\n"
    for (i = 0; i < fileCount; i++) {
      var serverList = fs.readFileSync("./users/" + files[i])
      if (serverList.includes(chatID)) {
        var name = files[i].replace(".txt", "")
        var myStreamers = myStreamers + name + "\n"
      }
    }
    message.channel.send(myStreamers)
  })
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'mystreamers',
  description: 'Lists all streamers registered to a text channel.',
  usage: '!mystreamers'
};
