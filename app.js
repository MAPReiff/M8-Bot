//Invite link https://discordapp.com/oauth2/authorize?client_id=278362996349075456&scope=bot&permissions=37223488

var version = "Beta 2.3.1";
var website = "http://comixsyt.space";

var fs = require("fs");

const Discord = require("discord.js");
const client = new Discord.Client();

const Carina = require('carina').Carina;
const ws = require('ws');

Carina.WebSocket = ws;
const ca = new Carina({ isBot: true }).open();

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
});

var streamersRaw = fs.readFileSync("./streamers.txt", "utf-8");
var streamers = streamersRaw.split(", ");
var streamerCount = streamers.length;

for (i=0; i<streamerCount; i++){
  var request = require("request");
  request("https://beam.pro/api/v1/channels/" + streamers[i], function (error, response, body) {
    if (!error && response.statusCode == 200) {
       var beamInfo = JSON.parse(body);
       const beamID = beamInfo.id;
       ca.subscribe(`channel:${beamID}:update`, data => {
         var beamStatus = data.online
         //console.log(data);
         if (beamStatus == true){
           const hook = new Discord.WebhookClient(hookID[0], hookID[1]);
           hook.sendMessage("live " + beamInfo.token);
         }
       })
     }
   });
 }

client.on("message", msg => {
  if (msg.content === "ping") {
    msg.delete(1000);
    msg.reply("Pong!");
  }
  if (msg.content === "pong") {
    msg.delete(1000);
    msg.reply("Ping!");
  }
  if (msg.content == "!rawr"){
    msg.delete(1000);
    msg.channel.sendMessage("http://i.imgur.com/CVHyMXt.png");
  }
  if (msg.content == "!add-streamer"){
    msg.delete(1000);
    msg.reply("You need to specify a streamer's beam ID. For example '!add-streamer STREAMER_ID'.");
  }
  if (msg.content.startsWith("!add-streamer")){
    msg.delete(1000);
    let args = msg.content.split(" ").slice(1);
    let streamer = args[0];
    var chatID = msg.channel.id;
      var owner = msg.guild.ownerID;
      if (owner == msg.author.id || msg.author.id == "145367010489008128"){
        if (!fs.existsSync("./users/" + streamer + ".txt")){
          fs.writeFile("./users/" + streamer + ".txt", chatID);
          var currentStreamers = fs.readFileSync("./streamers.txt", "utf-8");
          fs.writeFile("./streamers.txt", currentStreamers + ", " + streamer);
          var request = require("request");
          request("https://beam.pro/api/v1/channels/" + streamer, function (error, response, body) {
            if (!error && response.statusCode == 200) {
               var beamInfo = JSON.parse(body);
               const beamID = beamInfo.id;
               ca.subscribe(`channel:${beamID}:update`, data => {
                 var beamStatus = data.online
                 if (beamStatus == true){
                   const hook = new Discord.WebhookClient(hookID[0], hookID[1]);
                   hook.sendMessage("live " + beamInfo.token);
                 }
               })
             }
           });
        }
        if (fs.existsSync("./users/" + streamer + ".txt")){
          var currentServers = fs.readFileSync("./users/" + streamer + ".txt", "utf-8");
          var registered = currentServers.includes(chatID);
          if (registered === true){
            msg.reply("the streamer " + streamer + " is already registered!");
          }
          if (registered === false){
            fs.writeFile("./users/" + streamer + ".txt", currentServers + ", " + chatID);
            msg.reply("you have added  " + streamer + " to your server!");
          }
        }
      }
      else{
        msg.reply("You do not own this server; please do not try to add a streamer!");
      }

  }
  if (msg.content == "!m8status"){
    msg.delete(1000);
          const statusEmbed = new Discord.RichEmbed()
            .setTitle("M8 Bot Status")
            .setAuthor("M8 Bot")
            .setColor(0x9900FF)
            .setFooter("Sent via M8 Bot", "https://cdn.discordapp.com/app-icons/278362996349075456/ce8868a4a1ccbe2f3f746d864f61a206.jpg")
            .setThumbnail("https://cdn.discordapp.com/app-icons/278362996349075456/ce8868a4a1ccbe2f3f746d864f61a206.jpg")
            .setTimestamp()
            .addField("Version", version, true)
            .addField("Website", "http://comixsyt.space", true)
            .addField("Servers", serverCount, true)
            .addField("Users", userCount, true);
            msg.channel.sendEmbed(statusEmbed);
  }
  if (msg.content == "!help m8bot"){
    msg.delete(1000);
    const helpEmbed = new Discord.RichEmbed()
      .setTitle("M8 Bot Help")
      .setColor(0x9900FF)
      .setFooter("Sent via M8 Bot", "https://cdn.discordapp.com/app-icons/278362996349075456/ce8868a4a1ccbe2f3f746d864f61a206.jpg")
      .setThumbnail("https://cdn.discordapp.com/app-icons/278362996349075456/ce8868a4a1ccbe2f3f746d864f61a206.jpg")
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
      msg.channel.sendEmbed(helpEmbed);
  }
  if (msg.content.startsWith("live") && msg.author.id == hookID[0]){
    let args = msg.content.split(" ").slice(1);
    let beam = args[0];
    if (fs.existsSync("./users/" + beam + ".txt")){
      var request = require("request");
      request("https://beam.pro/api/v1/channels/" + beam, function (error, response, body) {
        if (!error && response.statusCode == 200) {
           var beamInfo = JSON.parse(body);
            if (beamInfo.type == null){
              var game = "[API ERROR]";
            }
            else{
              var game = beamInfo.type.name;
            }
             //msg.channel.sendMessage(beam + " is currently live @ http://beam.pro/" + beam);
             const liveEmbed = new Discord.RichEmbed()
               .setTitle(beam + "\'s Stream")
               .setAuthor(beam)
               .setColor(0x9900FF)
               .setDescription("Hey guys, " + beam + " is live right now! Click above to watch!")
               .setFooter("Sent via M8 Bot", "https://cdn.discordapp.com/app-icons/278362996349075456/ce8868a4a1ccbe2f3f746d864f61a206.jpg")
               .setThumbnail(beamInfo.user.avatarUrl)
               .setTimestamp()
               .setURL("http://beam.pro/" + beam)
               .addField("Streaming", game, true)
               .addField("Followers", beamInfo.numFollowers, true)
               .addField("Viewers", beamInfo.viewersCurrent, true)
               .addField("Total Views", beamInfo.viewersTotal, true)
             var serversAllowedRaw = fs.readFileSync("./users/" + beam + ".txt", "utf-8");
             var serversAllowed = serversAllowedRaw.split(", ");
             for (i=0; i < serversAllowed.length; i++){
               //client.channels.get(serversAllowed[i]).sendMessage("@here, " + beam + " is live @ http://beam.pro/" + beam + " & is streaming " + beamInfo.type.name + "!");
               //client.channels.get(serversAllowed[i]).sendMessage("@here");
               client.channels.get(serversAllowed[i]).sendEmbed(liveEmbed, "@here, " + beam + " is live!");
             }
           }
       });
      }
    }
  if (msg.content == "!server"){
    msg.delete(1000);
    if (msg.guild.available){
      if (msg.guild.iconURL = null){
        var iconURL = "https://newagesoldier.com/wp-content/uploads/2016/12/masbot.png";
      }
      else{
        var iconURL = msg.guild.iconURL;
      }
    const serverEmbed = new Discord.RichEmbed()
        .setTitle(msg.guild.name)
        .setColor(0x9900FF)
        .setFooter("Sent via M8 Bot", "https://cdn.discordapp.com/app-icons/278362996349075456/ce8868a4a1ccbe2f3f746d864f61a206.jpg")
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
        msg.channel.sendEmbed(serverEmbed);
        //msg.channel.sendMessage();
    }
  }
  if (msg.content == "!me"){
    msg.delete(1000);
    const meEmbed = new Discord.RichEmbed()
      .setTitle(msg.author.username)
      .setColor(0x9900FF)
      .setFooter("Sent via M8 Bot", "https://cdn.discordapp.com/app-icons/278362996349075456/ce8868a4a1ccbe2f3f746d864f61a206.jpg")
      .setThumbnail(msg.author.displayAvatarURL)
      .setTimestamp()
      .addField("ID", msg.author.id, true)
      .addField("Bot", msg.author.bot, true)
      .addField("Registered", msg.author.createdAt)
      msg.channel.sendEmbed(meEmbed);
  }
  if (msg.content == "!pun" || msg.content == "!dadjoke"){
    msg.delete(1000);
    var request = require("request");
    request("http://www.murfguy.com/puns.php", function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var pun = body;
        msg.channel.sendMessage(pun);
      }
    });
  }
  if (msg.content == "!bill"){
      msg.delete(1000);
      const billEmbed = new Discord.RichEmbed()
      .setAuthor("Bill")
      .setFooter("Sent via M8 Bot", "https://cdn.discordapp.com/app-icons/278362996349075456/ce8868a4a1ccbe2f3f746d864f61a206.jpg")
      .setTimestamp()
      .setImage("http://belikebill.azurewebsites.net/billgen-API.php?default=1")
      msg.channel.sendEmbed(billEmbed);
  }
  if (msg.content == "!billme"){
    msg.delete(1000);
    const billMeEmbed = new Discord.RichEmbed()
    .setAuthor(msg.author.username)
    .setFooter("Sent via M8 Bot", "https://cdn.discordapp.com/app-icons/278362996349075456/ce8868a4a1ccbe2f3f746d864f61a206.jpg")
    .setTimestamp()
    .setImage("http://belikebill.azurewebsites.net/billgen-API.php?default=1&name=" + msg.author.username + "&")
    msg.channel.sendEmbed(billMeEmbed);
  }
  if (msg.content.startsWith("!bill ") && msg.content != "!billme" && msg.content != "bill"){
    msg.delete(1000);
    var name = msg.content.replace("!bill ", "")
    var stringName = name.replace(" ", "%20")
    const billCustomEmbed = new Discord.RichEmbed()
    .setAuthor(stringName)
    .setFooter("Sent via M8 Bot", "https://cdn.discordapp.com/app-icons/278362996349075456/ce8868a4a1ccbe2f3f746d864f61a206.jpg")
    .setTimestamp()
    .setImage("http://belikebill.azurewebsites.net/billgen-API.php?default=1&name=" + stringName + "&")
    msg.channel.sendEmbed(billCustomEmbed);
  }
  if (msg.content == "!avatar" || msg.content == "!icon"){
    msg.delete(1000);
    var rn = require('random-number');
    var random = rn(0,9999999999999999);
    const avatarEmbed = new Discord.RichEmbed()
      .setTitle(msg.author.username + "'s new avatar!")
      .setImage("https://api.adorable.io/avatars/" + random)
      .setFooter("Sent via M8 Bot", "https://cdn.discordapp.com/app-icons/278362996349075456/ce8868a4a1ccbe2f3f746d864f61a206.jpg")
      .setTimestamp()
      msg.channel.sendEmbed(avatarEmbed);
  }
  if (msg.content == "!cn" || msg.content == "!chuck" || msg.content == "!chucknorris"){
    msg.delete(1000);
    var request = require("request");
    request("https://api.chucknorris.io/jokes/random", function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        msg.channel.sendMessage("**Chuck Norris Fact:** " + info.value);
      }
    });
  }

});

var token = fs.readFileSync("./token.txt", "utf-8");

client.login(token);
