var sourceFile = require('../m8botdev.js');
const Discord = require('discord.js');
const client = new Discord.Client();
var fs = require("fs")
var rootDir = __dirname.replace("commands", "")

exports.run = (client, message) => {
  message.delete();
  var request = require("request");
  request("http://comixsyt.space/blamecomixs/comixsblamecount_nc.php", function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var count = body
      fs.writeFile(rootDir + "/blameComixs.txt", count)
      console.log(count)
    }
  });
  const statusEmbed = new Discord.RichEmbed()
    .setTitle("M8 Bot Status")
    .setAuthor("M8 Bot")
    .setColor(sourceFile.embedColor)
    .setFooter("Sent via M8 Bot", sourceFile.botLogo)
    .setThumbnail(sourceFile.botLogo)
    .setTimestamp()
    .addField("Version", sourceFile.version, true)
    .addField("Website", sourceFile.website, true)
    .addField("Servers", client.guilds.size, true)
    .addField("Users", client.users.size, true)
    .addField("Comixs Was Blamed", fs.readFileSync(rootDir + "/blameComixs.txt", "utf-8") + " times", true)
    .addField("Twitter", sourceFile.botTwitter, true)
    .addField("Discord Server", sourceFile.officialDiscord, true)
  message.channel.send({
    embed: statusEmbed
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'm8status',
  description: 'Gets a status report on the bot.',
  usage: '!m8status'
};
