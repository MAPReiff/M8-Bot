exports.run = (client, message) => {
  message.delete();
  var mixer = message.content.replace("!mixer ", "")
  var request = require("request"); //the var to request details on the streamer
  request("https://mixer.com/api/v1/channels/" + mixer, function(error, response, body) { //set info for the streamer in JSON
    if (!error && response.statusCode == 200) { //if there is no error checking
      var mixerInfo = JSON.parse(body); //setting a var for the JSON info
      const Discord = require("discord.js");
      const mixerStuff = new Discord.RichEmbed()
        .setColor(0x9900FF)
        .setTitle(mixerInfo.token)
        .setFooter("Sent via M8 Bot", "http://i.imgur.com/nXvRJXM.png")
        .setTimestamp()
        .setThumbnail(mixerInfo.user.avatarUrl)
        .setURL("http://mixer.com/" + mixer)
        .addField("Online", mixerInfo.online, true)
        .addField("Followers", mixerInfo.numFollowers, true)
        .addField("Mixer Level", mixerInfo.user.level, true)
        .addField("Total Views", mixerInfo.viewersTotal, true)
        .addField("Joined mixer", mixerInfo.createdAt, true)
        .addField("Audience", mixerInfo.audience, true)
        .addField("Partnered", mixerInfo.partnered, true)
      message.channel.send({
        embed: mixerStuff
      })
    } else {
      message.reply("error finding that streamer, are you sure that was the correct name?")
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
  name: 'mixer',
  description: 'Gets info about a mixer user.',
  usage: '!mixer ___'
};
