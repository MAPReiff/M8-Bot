//Invite link https://discordapp.com/oauth2/authorize?client_id=278362996349075456&scope=bot&permissions=2117598327

var version = "Beta 6.0.1";

var website = "http://comixsyt.space";
var botTwitter = "https://twitter.com/M8_Bot"
var officialDiscord = "https://discord.gg/JBrAVYD"
var embedColor = 0x9900FF;
var botLogo = "http://i.imgur.com/nXvRJXM.png";

var fs = require("fs");

var Twitter = require('twitter');

const ytdl = require('ytdl-core');


// var search = require('youtube-search');
//
// var opts = {
//     maxResults: 1,
//     key: fs.readFileSync("./YTAPI.txt", "utf-8"),
//     type: "video"
// };


const Discord = require("discord.js");
const client = new Discord.Client();

const Carina = require('carina').Carina;
const ws = require('ws');

Carina.WebSocket = ws;
const ca = new Carina({
  isBot: true
}).open();

var hookIDRaw = fs.readFileSync("./hook.txt", "utf-8");
var hookID = hookIDRaw.split(", ");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.username}!`);
  console.log("Version " + version);
  serverCount = client.guilds.size;
  userCount = client.users.size
  client.user.setGame(version);
  console.log("Bot is on " + serverCount + " servers!");
  console.log("Those " + serverCount + " servers have a total of " + userCount + " members!");
  fs.writeFile("./chatIDList.txt", client.channels.map(c => c.id))
  //console.log(client.channels.map(c => c.id))



});

var streamersRaw = fs.readFileSync("./streamers.txt", "utf-8");
var streamers = streamersRaw.split(", ");
var streamerCount = streamers.length;


for (i = 0; i < streamerCount; i++) { //Run for the # of streamers
  var halfHour = 1800000; //time in milis that is 30min
  var bootTime = (new Date).getTime(); //get the time the bot booted up
  var halfHourAgo = bootTime - 1800000; //get the time 30min before the boot
  fs.writeFile("./user_time/" + streamers[i] + "_time.txt", halfHourAgo); //write a file with
  var request = require("request"); //the var to request details on the streamer
  request("https://mixer.com/api/v1/channels/" + streamers[i], function(error, response, body) { //ste info for the streamer in JSON
    if (!error && response.statusCode == 200) { //if there is no error checking
      var mixerInfo = JSON.parse(body); //setting a var for the JSON info
      const mixerID = mixerInfo.id; //getting the ID of the streamer
      console.log("Now stalking " + mixerInfo.token + " on mixer!"); //logs that the bot is watching for the streamer to go live
      ca.subscribe(`channel:${mixerID}:update`, data => { //subscribing to the streamer
        var mixerStatus = data.online //checks if they are online (its a double check just incase the above line miss fires)
        if (mixerStatus == true) { //if the bam info JSON says they are live
          var liveTime = (new Date).getTime(); //time the bot sees they went live
          var lastLiveTime = fs.readFileSync("./user_time/" + mixerInfo.token + "_time.txt", "utf-8"); //checks the last live time
          var timeDiff = liveTime - lastLiveTime; //gets the diff of urrent and last live times
          //console.log(timeDiff);
          if (timeDiff >= halfHour) { //if its been 30min or more
            console.log(mixerInfo.token + " went live, as its been more than 30min!"); //log that they went live
            const hook = new Discord.WebhookClient(hookID[0], hookID[1]); //sets info about a webhook
            hook.sendMessage("live " + mixerInfo.token); //tells the webhook to send a message to a private channel that M8Bot is listening to
          }
          if (timeDiff < halfHour) { //if its been less than 30min
            console.log(mixerInfo.token + " attempted to go live, but its been under 30min!"); //log that its been under 30min
          }
          fs.writeFile("./user_time/" + mixerInfo.token + "_time.txt", liveTime); //update last live time regardless if they went live or not
        }
      })
    }
  });
}

client.on("message", msg => {
  if (msg.content === "ping") {
    msg.delete(1000);
    msg.reply("Pong!").then(msg => msg.delete(1500));
  }
  if (msg.content === "pong") {
    msg.delete(1000);
    msg.reply("Ping!").then(msg => msg.delete(1500));
  }
  if (msg.content == "!rawr") {
    msg.delete(1000);
    msg.channel.send("http://i.imgur.com/CVHyMXt.png");
  }
  if (msg.content == "!add-streamer") {
    msg.delete(1000);
    msg.reply("You need to specify a streamer's mixer ID. For example '!add-streamer STREAMER_ID'.");
  }
  if (msg.content.startsWith("!add-streamer")) { //if an owner adds a streamer
    msg.delete(1000); //delete the message they sent
    let args = msg.content.split(" ").slice(1); //divide the message into args
    let streamer = args[0]; //arg 0 is the streamer's name
    var chatID = msg.channel.id; //gets the chat ID that they added the streamer to
    var owner = msg.guild.ownerID; //gets the server owner's id
    if (owner == msg.author.id || msg.author.id == "145367010489008128" || msg.member.hasPermission("ADMINISTRATOR")) { //if the person who added the streamer is the owner or ComixsYT or an admin
      if (fs.existsSync("./users/" + streamer + ".txt")) { //if they are already in our database
        var currentServers = fs.readFileSync("./users/" + streamer + ".txt", "utf-8"); //get the current allowed servers from their file
        var registered = currentServers.includes(chatID); //checks if the server they are being added to already has them
        if (registered === true) { //if they are already registered on the server
          msg.reply("the streamer " + streamer + " is already registered!"); //tell the server owner they are alreayd on
        }
        if (registered === false && !currentServers.includes(chatID)) { //if they arent on the server alreayd
          fs.writeFile("./users/" + streamer + ".txt", currentServers + ", " + chatID); //adds the new server ID to their list
          msg.reply("you have added the streamer " + streamer + " to your server!"); //tells the server owner that the streamer was added
        }
      }
      if (!fs.existsSync("./users/" + streamer + ".txt")) { //if they are not in our database yet
        fs.writeFile("./users/" + streamer + ".txt", "301435504761765889, " + chatID); //makes a new file with the chat ID
        var currentStreamers = fs.readFileSync("./streamers.txt", "utf-8"); //gets the current total streamer list
        fs.writeFile("./streamers.txt", currentStreamers + ", " + streamer); //updates the total list with the new streamer added
        var halfHour = 1800000; //time in milis that is 30min
        var addedTime = (new Date).getTime(); //get the time the bot added the streamer
        var halfHourAgo = addedTime - 1800000; //get the time 30min before they were added
        fs.writeFile("./user_time/" + streamer + "_time.txt", halfHourAgo); //write a file with
        var request = require("request"); //the var to request details on the streamer
        request("https://mixer.com/api/v1/channels/" + streamer, function(error, response, body) { //ste info for the streamer in JSON
          if (!error && response.statusCode == 200) { //if there is no error checking
            var mixerInfo = JSON.parse(body); //setting a var for the JSON info
            const mixerID = mixerInfo.id; //getting the ID of the streamer
            console.log("Now stalking " + mixerInfo.token + " on mixer!"); //logs that the bot is watching for the streamer to go live
            ca.subscribe(`channel:${mixerID}:update`, data => { //subscribing to the streamer
              var mixerStatus = data.online //checks if they are online (its a double check just incase the above line miss fires)
              if (mixerStatus == true) { //if the bam info JSON says they are live
                var liveTime = (new Date).getTime(); //time the bot sees they went live
                var lastLiveTime = fs.readFileSync("./user_time/" + mixerInfo.token + "_time.txt", "utf-8"); //checks the last live time
                var timeDiff = liveTime - lastLiveTime; //gets the diff of urrent and last live times
                //console.log(timeDiff);
                if (timeDiff >= halfHour) { //if its been 30min or more
                  console.log(mixerInfo.token + " went live, as its been more than 30min!"); //log that they went live
                  const hook = new Discord.WebhookClient(hookID[0], hookID[1]); //sets info about a webhook
                  hook.sendMessage("live " + mixerInfo.token); //tells the webhook to send a message to a private channel that M8Bot is listening to
                }
                if (timeDiff < halfHour) { //if its been less than 30min
                  console.log(mixerInfo.token + " attempted to go live, but its been under 30min!"); //log that its been under 30min
                }
                fs.writeFile("./user_time/" + mixerInfo.token + "_time.txt", liveTime); //update last live time regardless if they went live or not
              }
            })
          }
        });
      }

    } else { //if the person who added the streamer is not the server owner
      msg.reply("You do not own this server; please do not try to add a streamer!"); //tell them they cant add a streamer
    }
  }

  if (msg.content.startsWith("!remove-streamer") || msg.content.startsWith("!del-streamer")) { //if an owner removes a streamer
    msg.delete(1000); //delete the message they sent
    let args = msg.content.split(" ").slice(1); //divide the message into args
    let streamer = args[0]; //arg 0 is the streamer's name
    var chatID = msg.channel.id; //gets the chat ID that they added the streamer to
    var owner = msg.guild.ownerID; //gets the server owner's id
    if (owner == msg.author.id || msg.author.id == "145367010489008128" || msg.member.hasPermission("ADMINISTRATOR")) { //if the person is the owner or ComixsYT or an admin
      if (!fs.existsSync("./users/" + streamer + ".txt")) { //if they are not in our database yet
        msg.reply(streamer + " was not removed from your server, as you never added them!")
      }
      if (fs.existsSync("./users/" + streamer + ".txt")) { //if they are already in our database
        var currentServers = fs.readFileSync("./users/" + streamer + ".txt", "utf-8"); //get the current allowed servers from their file
        var registered = currentServers.includes(chatID); //checks if the server they are being added to already has them
        if (registered === true) { //if they are already registered on the server
          if (currentServers == "301435504761765889, " + chatID) {
            fs.unlinkSync("./users/" + streamer + ".txt");
            var streamersRaw = fs.readFileSync("./streamers.txt", "utf-8");
            var newStreamers = streamersRaw.replace(streamer, "");
            msg.reply("you have removed " + streamer + " from the server!")

          } else {
            // if (currentServers.includes(chatID + ", ") && !currentServers.includes(", " + chatID)){
            //   var newChatList = currentServers.replace(chatID + ", ", "")
            // }
            if (currentServers.includes(", " + chatID)) {
              var newChatList = currentServers.replace(", " + chatID, "")
            }
            fs.writeFile("./users/" + streamer + ".txt", newChatList)
            msg.reply("you have removed " + streamer + " from the server!")
          }
        }
      }


    } else { //if the person who added the streamer is not the server owner
      msg.reply("You do not own this server; please do not try to remove a streamer!"); //tell them they cant add a streamer
    }
  }

  if (msg.content == "!m8status") {
    msg.delete(1000);
    var request = require("request");
    request("http://comixsyt.space/blamecomixs/comixsblamecount_nc.php", function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var count = body
        fs.writeFile("./blameComixs.txt", count)
        console.log(count)
      }
    });
    const statusEmbed = new Discord.RichEmbed()
      .setTitle("M8 Bot Status")
      .setAuthor("M8 Bot")
      .setColor(embedColor)
      .setFooter("Sent via M8 Bot", botLogo)
      .setThumbnail(botLogo)
      .setTimestamp()
      .addField("Version", version, true)
      .addField("Website", website, true)
      .addField("Servers", client.guilds.size, true)
      .addField("Users", client.users.size, true)
      .addField("Comixs Was Blamed", fs.readFileSync("./blameComixs.txt", "utf-8") + " times", true)
      .addField("Hugs Given", fs.readFileSync("./hugcount.txt", "utf-8"), true)
      .addField("Twitter", botTwitter, true)
      .addField("Discord Server", officialDiscord, true)
    msg.channel.send({
      embed: statusEmbed
    });
  }
  if (msg.content == "!help m8bot") {
    msg.delete(1000);
    const helpEmbed = new Discord.RichEmbed()
      .setTitle("M8 Bot Help")
      .setColor(embedColor)
      .setFooter("Sent via M8 Bot", botLogo)
      .setThumbnail(botLogo)
      .setTimestamp()
      .addField("!help m8bot", "Sends this Help Message")
      .addField("ping/pong", "Send ping or pong to test if the bot is listening")
      //.addField("!live", "Sends out a fancy live message if you are a registered streamer")
      .addField("!m8status", "Sends a status report of the bot")
      .addField("!me", "Sends user info about themself")
      .addField("!pun or !dadjoke", "Sends a funny pun courtesy of murfGUY's dadjoke database")
      .addField("!bill, !billme & !bill NAME", "Creates a be like bill meme. If you do !billme, your name will be in there. If you do !bill NAME, the name you put will be in there.")
      .addField("!avatar", "Generate a new profile avatar via the adorable.io api!")
      .addField("!cn or !chuck or !chucknorris", "Pulls a random Chun Norris fact!")
      .addField("!blamecomixs", "Used whenever ComixsYT does something stupid and must be blamed!")
      .addField("!lenny", "( ͡° ͜ʖ ͡°)", true)
      .addField("!ascii", "Get your words in ASCII form!", true)
      .addField("!urban or !define", "Get the urban definition of a word!")
      .addField("!lmgtfy or !google", "Gets a Let Me Google That For You link for any term you want!")
      .addField("!mfinger", "Allows you to give the finger that is located in the middle of our appendages to others!")
      .addField("!fail", "For when someone serriously fails!")
      .addField("!pepe", "Who doesnt love Pepe?")
      .addField("!tank", "GTFO of my way I got a fucking tank!")
      .addField("!hug or !hugs", "Wanna give someone a hug? Do it then! \nUssage1 - !hugs name \nUssage 2 - !hug name")
      .addField("!copypasta", "Gets a random, 100% supid, copypasta!")
      .addField("!m8bug", "Returns a link to report bugs!")
      .addField("!add-streamer & !del-streamer", "Used to add or delete streamers from that chat channel. Can only be run by the server owner or anyone with the \"ADMINISTRATOR\" permission.")
      .addField("!allstreamers", "Lists all the streamers that the bot stalks.")
      .addField("!mystreamers", "Lists all streamers in that channel.")
      .addField("!mixer", "Gets info about a mixer user. Usage - !mixer NAME")
      .addField("!ping on/off", "Allows a server owner/admin to decide whether or not M8 Bot can use @here in that channel. Default is on.")
      //.addField("!play YT-LINK", "Plays the audio of a youtube link in a voice chat. User must be in a voice channel to use the command.")
    msg.channel.send({
      embed: helpEmbed
    });
  }
  if ((msg.content.startsWith("live") && msg.author.id == hookID[0]) || //if the bot sends the message
    (msg.content.startsWith("live") && msg.author.id == "145367010489008128" && msg.channel.id == "278697660133801984")) { //if comixs sends the message (and in certian chat)
    let args = msg.content.split(" ").slice(1); //seperare command into args
    let mixer = args[0]; //mixer name is arg 0
    if (fs.existsSync("./users/" + mixer + ".txt")) { //varifies that the streamer is on record
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
            .setColor(embedColor)
            .setDescription("Hey guys, " + mixer + " is live right now! Click above to watch!")
            .setFooter("Sent via M8 Bot", botLogo)
            .setThumbnail(mixerInfo.user.avatarUrl)
            .setTimestamp()
            .setURL("http://mixer.com/" + mixer)
            .addField("Streaming", game, true)
            .addField("Followers", mixerInfo.numFollowers, true)
            .addField("mixer Level", mixerInfo.user.level, true)
            .addField("Total Views", mixerInfo.viewersTotal, true) //end the embed message template
          var serversAllowedRaw = fs.readFileSync("./users/" + mixer + ".txt", "utf-8"); //get the list of servers they are allowed to ne announced on
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
          tweetClient.post('statuses/update', {
            status: tweetMessage
          })
        }
      });
    }
  }
  if (msg.content == "!server") {
    msg.delete(1000);
    if (msg.guild.available = true) {
      console.log("Nice Meme")
      if (msg.guild.iconURL = null) {
        var iconURL = "https://newagesoldier.com/wp-content/uploads/2016/12/masbot.png";
      } else {
        var iconURL = msg.guild.iconURL;
      }
      const serverEmbed = new Discord.RichEmbed()
        .setTitle(msg.guild.name)
        .setColor(embedColor)
        .setFooter("Sent via M8 Bot", botLogo)
        .setThumbnail(iconURL)
        .setTimestamp()
        .addField("Server ID", msg.guild.id, true)
        .addField("Region", msg.guild.region, true)
        .addField("Owner", msg.guild.owner, true)
        .addField("Members", msg.guild.memberCount, true)
        .addField("Roles", msg.guild.roles.size, true)
        .addField("Channels", msg.guild.channels.size, true)
        .addField("Created At", msg.guild.createdAt)
        .addField("Joined Server At", msg.guild.joinedAt)
      msg.channel.send({
        embed: serverEmbed
      });
      //msg.channel.sendMessage();
    } else {
      msg.reply
    }
  }
  if (msg.content == "!me") {
    msg.delete(1000);
    const meEmbed = new Discord.RichEmbed()
      .setTitle(msg.author.username)
      .setColor(embedColor)
      .setFooter("Sent via M8 Bot", botLogo)
      .setThumbnail(msg.author.displayAvatarURL)
      .setTimestamp()
      .addField("ID", msg.author.id, true)
      .addField("Bot", msg.author.bot, true)
      .addField("Registered", msg.author.createdAt)
    msg.channel.send({
      embed: meEmbed
    });
  }
  if (msg.content == "!pun" || msg.content == "!dadjoke") {
    msg.delete(1000);
    var request = require("request");
    request("http://www.murfguy.com/puns.php", function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var pun = body;
        msg.channel.send(pun);
      }
    });
  }
  if (msg.content == "!bill") {
    msg.delete(1000);
    const billEmbed = new Discord.RichEmbed()
      .setAuthor("Bill")
      .setFooter("Sent via M8 Bot", botLogo)
      .setTimestamp()
      .setImage("http://belikebill.azurewebsites.net/billgen-API.php?default=1")
    msg.channel.send({
      embed: billEmbed
    });
  }
  if (msg.content == "!billme") {
    msg.delete(1000);
    const billMeEmbed = new Discord.RichEmbed()
      .setAuthor(msg.author.username)
      .setFooter("Sent via M8 Bot", botLogo)
      .setTimestamp()
      .setImage("http://belikebill.azurewebsites.net/billgen-API.php?default=1&name=" + msg.author.username + "&")
    msg.channel.send({
      embed: billMeEmbed
    });
  }
  if (msg.content.startsWith("!bill ") && msg.content != "!billme" && msg.content != "bill") {
    msg.delete(1000);
    var name = msg.content.replace("!bill ", "")
    var stringName = name.replace(" ", "%20")
    const billCustomEmbed = new Discord.RichEmbed()
      .setAuthor(stringName)
      .setFooter("Sent via M8 Bot", botLogo)
      .setTimestamp()
      .setColor(embedColor)
      .setImage("http://belikebill.azurewebsites.net/billgen-API.php?default=1&name=" + stringName + "&")
    msg.channel.send({
      embed: billCustomEmbed
    });
  }
  if (msg.content == "!avatar" || msg.content == "!icon") {
    msg.delete(1000);
    var rn = require('random-number');
    var random = rn(0, 9999999999999999);
    const avatarEmbed = new Discord.RichEmbed()
      .setTitle(msg.author.username + "'s new avatar!")
      .setImage("https://api.adorable.io/avatars/" + random)
      .setFooter("Sent via M8 Bot", botLogo)
      .setTimestamp()
    msg.channel.send({
      embed: avatarEmbed
    });
  }
  if (msg.content == "!cn" || msg.content == "!chuck" || msg.content == "!chucknorris") {
    msg.delete(1000);
    var request = require("request");
    request("https://api.chucknorris.io/jokes/random", function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        msg.channel.send("**Chuck Norris Fact:** " + info.value);
      }
    });
  }
  if (msg.content == "!blamecomixs") {
    msg.delete(1000)
    var request = require("request");
    request("https://comixsyt.space/blamecomixs/comixsblamecount.php", function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var count = body;
        msg.channel.send("Wow, Comixs has been blamed **" + count + "** times! Thanks " + msg.author + "!");
      }
    });
  }

  if (msg.content == "!lenny") {
    msg.delete(1000);
    msg.channel.send("( ͡° ͜ʖ ͡°)");
  }
  if (msg.content.startsWith("!ascii")) {
    msg.delete(1000);
    var input = msg.content.replace("!ascii ", "");
    var request = require("request");
    request("https://artii.herokuapp.com/make?text=" + input, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var ascii = body;
        msg.channel.send("```\n " + msg.author.username + " has requested \"" + input + "\" in ASCII from! \n" + ascii + "```");
      }
    });
  }
  //Feature Requested by IronTaters
  if (msg.content.startsWith("!define") || msg.content.startsWith("!urban")) {
    msg.delete(1000);
    if (msg.content.startsWith("!define")) {
      var term = msg.content.replace("!define ", "");
    }
    if (msg.content.startsWith("!urban")) {
      var term = msg.content.replace("!urban ", "");
    }
    var request = require("request");
    request("http://api.scorpstuff.com/urbandictionary.php?term=" + term, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var def = body;
        msg.channel.send(def);
      }
    });
  }
  if (msg.content.startsWith("!lmgtfy") || msg.content.startsWith("!google")) {
    msg.delete(1000);
    if (msg.content.startsWith("!lmgtfy")) {
      var term = msg.content.replace("!lmgtfy ", "");
    }
    if (msg.content.startsWith("!google")) {
      var term = msg.content.replace("!google ", "");
    }
    var input = term.replace(" ", "+");
    msg.channel.send("Here's your google link " + msg.author + " - http://lmgtfy.com/?q=" + input);
  }
  //requested by Pot4tus
  if (msg.content == "!mfinger") {
    msg.delete(1000);
    var mFingerASCII = fs.readFileSync("./ascii/mFinger.txt", "utf-8");
    msg.channel.send("```\nSent by " + msg.author.username + ".\n" + mFingerASCII + "\n```");
  }
  if (msg.content == "!fail") {
    msg.delete(1000);
    var failASCII = fs.readFileSync("./ascii/fail.txt", "utf-8");
    msg.channel.send("```\nSent by " + msg.author.username + ".\n" + failASCII + "\n```");
  }
  if (msg.content == "!pepe") {
    msg.delete(1000);
    var pepeASCII = fs.readFileSync("./ascii/pepe.txt", "utf-8");
    msg.channel.send("```\nSent by " + msg.author.username + ".\n" + pepeASCII + "\n```");
  }
  if (msg.content == "!tank") {
    msg.delete(1000);
    var tankASCII = fs.readFileSync("./ascii/tank.txt", "utf-8");
    msg.channel.send("```\nSent by " + msg.author.username + ".\n" + tankASCII + "\n```");
  }
  if (msg.content.startsWith("!hugs ") || msg.content.startsWith("!hug ")) {
    msg.delete(1000);
    if (msg.content.startsWith("!hugs ")) {
      var who = msg.content.replace("!hugs ", "")
    }
    if (msg.content.startsWith("!hug ")) {
      var who = msg.content.replace("!hug ", "")
    }
    msg.channel.send(msg.author + " gave " + who + " a nice, big, hug!");
    var currentHugs = fs.readFileSync("./hugcount.txt", "utf-8");
    var newHugs = parseInt(currentHugs) + 1;
    fs.writeFile("./hugcount.txt", newHugs);
  }
  if (msg.content == "!copypasta") {
    msg.delete(1000)
    var copyPastasRaw = fs.readFileSync("./copyPastas.txt", "utf-8")
    var copyPastas = copyPastasRaw.split("_-_-")
    var randomPasta = copyPastas[Math.floor(Math.random() * copyPastas.length)];
    msg.channel.send("```\nRequested by " + msg.author.username + "!\n\n" + randomPasta + "\n```")
  }
  if (msg.content == "!m8bug") {
    msg.delete(1000)
    const bugEmbed = new Discord.RichEmbed()
      .setColor(embedColor)
      .setTitle("M8 Bot Bug Report")
      .setDescription("I am so sorry that you are having an issue with me!\nThere are a few ways to submit issues.")
      .addField("Github", "https://goo.gl/DVEsVs", true)
      .addField("Twitter", "https://goo.gl/kG3kRR", true)
      .addField("My Discord", officialDiscord, true)
      .setThumbnail(botLogo)
      .setFooter("Sent via M8 Bot", botLogo)
      .setTimestamp()
    msg.channel.send({
      embed: bugEmbed
    })
  }
  if (msg.content == "!serverlist") {
    msg.delete(1000)
    var listraw = client.guilds.map(g => g.name).toString()
    var list = listraw.replace(",", ", ")
    msg.channel.send("Current list of servers I am on **" + list + "**")
  }
  if (msg.content == "!allstreamers") {
    msg.delete(1000);
    var streamersRaw = fs.readFileSync("./streamers.txt", "utf-8");
    var streamers = streamersRaw.split(", ");
    var streamerCount = streamers.length;
    msg.channel.send("**Current List of Our " + streamerCount + " Streamers**\n", {
      file: "./streamers.txt"
    })
  }
  if (msg.content.startsWith("!mixer ")) {
    msg.delete(1000)
    var mixer = msg.content.replace("!mixer ", "")
    var request = require("request"); //the var to request details on the streamer
    request("https://mixer.com/api/v1/channels/" + mixer, function(error, response, body) { //set info for the streamer in JSON
      if (!error && response.statusCode == 200) { //if there is no error checking
        var mixerInfo = JSON.parse(body); //setting a var for the JSON info
        const mixerStuff = new Discord.RichEmbed()
          .setColor(embedColor)
          .setTitle(mixerInfo.token)
          .setFooter("Sent via M8 Bot", botLogo)
          .setTimestamp()
          .setThumbnail(mixerInfo.user.avatarUrl)
          .setURL("http://mixer.com/" + mixer)
          .addField("Online", mixerInfo.online, true)
          .addField("Followers", mixerInfo.numFollowers, true)
          .addField("mixer Level", mixerInfo.user.level, true)
          .addField("Total Views", mixerInfo.viewersTotal, true)
          .addField("Joined mixer", mixerInfo.createdAt, true)
          .addField("Audience", mixerInfo.audience, true)
          .addField("Partnered", mixerInfo.partnered, true)
        msg.channel.send({
          embed: mixerStuff
        })
      } else {
        msg.reply("error finding that streamer, are you sure that was the correct name?")
      }
    });
  }
  if (msg.content == "!mystreamers") {
    msg.delete(1000)
    const streamerFolder = './users/';
    const fs = require('fs');
    var chatID = msg.channel.id;
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
      msg.channel.send(myStreamers)
    })
  }
  //Feature Requested by DelboyDylan
  if (msg.content == "!ping off") {
    if (msg.author.id == msg.guild.ownerID || msg.member.hasPermission("ADMINISTRATOR")) {
      msg.channel.overwritePermissions("278362996349075456", {
        "MENTION_EVERYONE": false,
      })
      msg.reply("the @-here ping has been disabled in this channel.")
    } else {
      msg.reply("you do not have permission to run this command!")
    }
  }
  //Feature Requested by DelboyDylan
  if (msg.content == "!ping on") {
    if (msg.author.id == msg.guild.ownerID || msg.member.hasPermission("ADMINISTRATOR")) {
      msg.channel.overwritePermissions("278362996349075456", {
        "MENTION_EVERYONE": true,
      })
      msg.reply("the @-here ping has been enabled in this channel.")
    } else {
      msg.reply("you do not have permission to run this command!")
    }
  }
  if ((msg.content.startsWith("!m8say ")) && (msg.author.id = "145367010489008128")) {
    msg.delete(1000)
    var say = msg.content.replace("!m8say ", "")
    msg.channel.send(say)
  }
  if (msg.content.startsWith("!play ")) {
    msg.delete(1000)
    var song = msg.content.replace("!play ")
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel) return msg.reply("Please be in a voice channel first!");
    if (voiceChannel) {
      msg.channel.send("The song requested by " + msg.author.username + " will be played.")
      voiceChannel.join()
        .then(connnection => {
          const stream = ytdl(song, {
            filter: 'audioonly'
          });
          const dispatcher = connnection.playStream(stream);
          dispatcher.on('end', () => voiceChannel.leave());
        });
    }
  }

});

client.on("guildMemberAdd", member => {
  let guild = member.guild;
  var guildID = member.guild.id;
  var guildGeneral = member.guild.defaultChannel.id;
  //console.log(guildGeneral);
  //console.log(guildID);
  if (guildID == "250354580926365697") { //Meme M8s Guild ID
    member.addRole(guild.roles.find('name', 'Lil Meme'));
    //client.channels.get(guildGeneral).sendMessage("Hey " + member.displayName + ", welcome to the **Chill Spot**! You are now a Lil Meme. Please read #welcome and enjoy your stay!");
    //client.channels.get(guildGeneral).send("Hey " + member.name)
  }
  if (guildID == "169960109072449536") { //Innovative Studios Guild ID
    member.addRole(guild.roles.find('name', 'Citizens of Townsville'));
  }
});

client.on("guildCreate", guild => {
  console.log("I just joined a new server called " + guild.name)
  guild.defaultChannel.createInvite({
    maxAge: 0
  }).then(result => fs.writeFile("./servers/" + guild.name + ".txt", "Invite Code - " + result))
  guild.defaultChannel.send("Hey guys and gals! I\'m M8 Bot! Its great to meet you all, and I hope you enjoy me :P\nA list of my commands can be found by using \"!help m8bot\".\nIf you encounter any issues, you can type \"!m8bug\" to recive links to submit issues!")

  const joinedEmbed = new Discord.RichEmbed()
    .setColor(0x00FF00)
    .setTitle("Joined " + guild.name)
    .setFooter("Sent via M8 Bot", botLogo)
    .setTimestamp()
    .setThumbnail(guild.iconURL)
    .addField("Members", guild.memberCount, true)
    .addField("Owner", guild.owner, true)
  client.channels.get("316741092554833931").sendEmbed(joinedEmbed)

});

client.on("guildDelete", guild => {
  const leftEmbed = new Discord.RichEmbed()
    .setColor(0xFF0000)
    .setTitle("Left " + guild.name)
    .setFooter("Sent via M8 Bot", botLogo)
    .setTimestamp()
    .setThumbnail(guild.iconURL)
    .addField("Members", guild.memberCount, true)
    .addField("Owner", guild.owner, true)
  client.channels.get("316741092554833931").sendEmbed(leftEmbed)

});

//Tweet template
//tweetClient.post('statuses/update', {status: 'Stuff Here!'})

var twitterInfo = fs.readFileSync("./twitterInfo.txt", "utf-8").split(", ");
var consumerKey = twitterInfo[0];
var consumerSecret = twitterInfo[1];
var accessTokenKey = twitterInfo[2];
var accessTokenSecret = twitterInfo[3];

var tweetClient = new Twitter({
  consumer_key: consumerKey,
  consumer_secret: consumerSecret,
  access_token_key: accessTokenKey,
  access_token_secret: accessTokenSecret
});

// tweetClient.post('statuses/update', {status: 'I Love Twitter'})
// .then(function (tweet) {
//   console.log(tweet);
// })
// .catch(function (error) {
//   throw error;
// })

var token = fs.readFileSync("./token.txt", "utf-8");

client.login(token);
