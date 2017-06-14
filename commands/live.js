var userDir = __dirname.replace("commands", "users")
var rootDir = __dirname.replace("commands", "")
var timeDir = __dirname.replace("commands", "user_time")
// var sourceFile = require('../m8botdev.js');
// const settings = require(rootDir + '/settings.json');
// var Twitter = require('twitter');
// // var tweetClient = new Twitter({
// //   consumer_key: settings.consumer_key,
// //   consumer_secret: settings.consumer_secret,
// //   access_token_key: settings.access_token_key,
// //   access_token_secret: settings.access_token_secret
// // });

console.log(settings)

exports.run = (client, message) => {
  const Discord = require("discord.js");
  var fs = require("fs");

  if ((message.content.startsWith("!live") && message.author.id == "278697796398481408") || //if the bot sends the message
    (message.content.startsWith("!live") && message.author.id == "145367010489008128" && message.channel.id == "278697660133801984")) { //if comixs sends the message (and in certian chat)
    let args = message.content.split(" ").slice(1); //seperate command into args
    let mixer = args[0]; //mixer name is arg 0
    if (fs.existsSync(userDir + "/" + mixer + ".txt")) { //varifies that the streamer is on record
      var request = require("request"); //sets a var to request info
      request("https://mixer.com/api/v1/channels/" + mixer, function(error, response, body) { //request streamer's in in JSON form
        if (!error && response.statusCode == 200) { //if there is no error
          var mixerInfo = JSON.parse(body); //sets mixerInfo to the JSON data
          if (mixerInfo.type == null) { //if there is no game set to the stream
            var game = "[API ERROR]"; //set the game to the meme game
          } else { //if there is a game set
            var game = mixerInfo.type.name; //set the game var to the streamer's game
          }
          const liveEmbed = new Discord.RichEmbed() //start the embed message template
            .setTitle(mixerInfo.token + "\'s Stream")
            .setAuthor(mixerInfo.name)
            .setColor(0x9900FF)
            .setDescription("Hey guys, " + mixer + " is live right now! Click above to watch!")
            .setFooter("Sent via M8 Bot", "http://i.imgur.com/nXvRJXM.png")
            .setThumbnail(mixerInfo.user.avatarUrl)
            .setTimestamp()
            .setURL("http://mixer.com/" + mixer)
            .addField("Streaming", game, true)
            .addField("Followers", mixerInfo.numFollowers, true)
            .addField("Mixer Level", mixerInfo.user.level, true)
            .addField("Total Views", mixerInfo.viewersTotal, true) //end the embed message template
          var serversAllowedRaw = fs.readFileSync(userDir + "/" + mixer + ".txt", "utf-8"); //get the list of servers they are allowed to ne announced on
          var serversAllowed = serversAllowedRaw.split(", "); //splits the servers into individual strings
          for (i = 0; i < serversAllowed.length; i++) { //run for the total number of servers they are allowed on
            client.channels.get(serversAllowed[i]).sendEmbed(liveEmbed, "@here, " + mixer + " is live!"); //send the live message to servers
          }

          var shareMessage = mixerInfo.preferences.sharetext.replace("%URL%", "http://mixer.com/" + mixerInfo.token)
          if (shareMessage.includes("%USER%")) {
            tweetMessage = shareMessage.replace("%USER%", mixerInfo.token)
          }
          if (!shareMessage.includes("%USER%")) {
            tweetMessage = shareMessage;
          }
          // tweetClient.post('statuses/update', {
          //   status: tweetMessage
          // })
        }
      });
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'live',
  description: 'Force a live announcement.',
  usage: '!live ___'
};
