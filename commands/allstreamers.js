exports.run = (client, message) => {
  var fs = require("fs");
  message.delete();
  var rootDir = __dirname.replace("commands", "")
  var streamersRaw = fs.readFileSync(rootDir + "./streamers.txt", "utf-8");
  var streamers = streamersRaw.split(", ");
  var streamerCount = streamers.length;
  message.channel.send("**Current List of Our " + streamerCount + " Streamers**\n", {
    file: rootDir + "./streamers.txt"
  })
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['all-streamers'],
  permLevel: 0
};

exports.help = {
  name: 'allstreamers',
  description: 'Pulls a list of all the streamers that the bot stalks.',
  usage: '!allstreamers'
};
