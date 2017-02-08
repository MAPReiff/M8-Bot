//Invite link https://discordapp.com/oauth2/authorize?client_id=278362996349075456&scope=bot&permissions=37223488

var version = "0.7.4";
var website = "http://comixsyt.space";

var fs = require("fs");

const Discord = require("discord.js");
const client = new Discord.Client();

var hookIDRaw = fs.readFileSync("./hook.txt", "utf-8");
var hookID = hookIDRaw.split(", ");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.username}!`);
  console.log("Version " + version);
  serverCount = client.guilds.size;
  userCount = client.users.size
  console.log("Bot is on " + serverCount + " servers!");
  console.log("Those " + serverCount + " servers have a total of " + userCount + " members!");
});

setInterval(liveCheck, 60000); //1 min = 60000
function liveCheck(){

  var streamersRaw = fs.readFileSync("./streamers.txt", "utf-8");
  var streamers = streamersRaw.split(", ");
  var streamerCount = streamers.length;

  for (i=0; i < streamerCount; i++){
    //console.log(streamers[i]);
    var request = require("request");
    request("https://beam.pro/api/v1/channels/" + streamers[i], function (error, response, body) {
      if (!error && response.statusCode == 200) {
         var beamInfo = JSON.parse(body);
         var onTime = beamInfo.updatedAt;
         var d = new Date(onTime);
         var millis = d.getTime();
         var diff = new Date().getTime() -  millis;
         //console.log(diff);
         if (diff<=60000){
           const hook = new Discord.WebhookClient(hookID[0], hookID[1]);
           hook.sendMessage("live " + beamInfo.token);
         }
       }
    });
    }
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
  if (msg.content == ("!claim")){
    msg.delete(1000);
    var ownerID = msg.author.id;
    var chatID = msg.channel.id;
    //console.log(chatID + " " + ownerID);
    if (fs.existsSync("./servers/" + chatID + ".txt")) {
        msg.reply("This server has already been claimed!");
      }
    else{
      fs.writeFile("./servers/" + chatID + ".txt", ownerID);
    }
  }
  if (msg.content == ("!add-streamer")){
    msg.delete(1000);
    msg.reply("You need to specify a streamer's beam ID. For example '!add-streamer STREAMER_ID'.");
  }
  if (msg.content.startsWith("!add-streamer")){
    msg.delete(1000);
    let args = msg.content.split(" ").slice(1);
    let streamer = args[0];
    var chatID = msg.channel.id;
    if (fs.existsSync("./servers/" + chatID + ".txt")){
      var ownerRaw = fs.readFileSync("./servers/" + chatID + ".txt", "utf-8");
      var owner = ownerRaw.split(", ");
      if (owner == msg.author.id){
        if (!fs.existsSync("./users/" + streamer + ".txt")){
          fs.writeFile("./users/" + streamer + ".txt", chatID);
          var currentStreamers = fs.readFileSync("./streamers.txt", "utf-8");
          fs.writeFile("./streamers.txt", currentStreamers + ", " + streamer);
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
  }
  if (msg.content == ("!live")){
    msg.delete(1000);
    msg.reply("you need to specify a beam streamer; for example - '!live STREAMER NAME'.");
  }
  if (msg.content.startsWith("!live")){
    msg.delete(1000);
    let args = msg.content.split(" ").slice(1);
    let beam = args[0];
    if (fs.existsSync("./users/" + msg.author.id + ".txt")){
      var request = require("request");
      request("https://beam.pro/api/v1/channels/" + beam, function (error, response, body) {
        if (!error && response.statusCode == 200) {
           var beamInfo = JSON.parse(body);
           if (beamInfo.online == false){
             msg.channel.sendMessage(beam + " is not live right now.")
           }
           if (beamInfo.online == true){
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
             var serversAllowedRaw = fs.readFileSync("./users/" + msg.author.id + ".txt", "utf-8");
             var serversAllowed = serversAllowedRaw.split(", ");
             for (i=0; i < serversAllowed.length; i++){
               //client.channels.get(serversAllowed[i]).sendMessage("@here, " + beam + " is live @ http://beam.pro/" + beam + " & is streaming " + beamInfo.type.name + "!");
               //client.channels.get(serversAllowed[i]).sendMessage("@here");
               client.channels.get(serversAllowed[i]).sendEmbed(liveEmbed, "@here");
             }
           }
         }
         });
       }
       else{
         msg.reply("You are not a registered streamer! Please contact ComixsYT to be added.");
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
    // msg.channel.sendMessage("**M8 Bot Status:** \nVersion - " + version + "\nWebsite - " + website +
    //             "\nThe Bot is on " + serverCount + " servers! \nIn total, those " + serverCount +
    //             " servers have a total of " + userCount + " users, wow!");
  }
  if (msg.content == "!help m8bot"){
    msg.delete(1000);
    //msg.channel.sendMessage("**M8 Bot Commands:** \n!help m8bot - shows this message \n!live - sends out a live message for streamerrs; command requires a beam username with it \nping - replies pong to test if the bot is online \npong - same as ping (Gam3Pr0 was butthurt about it not existing) \n!m8status - status info about the bot");
    const helpEmbed = new Discord.RichEmbed()
      .setTitle("M8 Bot Help")
      .setColor(0x9900FF)
      .setFooter("Sent via M8 Bot", "https://cdn.discordapp.com/app-icons/278362996349075456/ce8868a4a1ccbe2f3f746d864f61a206.jpg")
      .setThumbnail("https://cdn.discordapp.com/app-icons/278362996349075456/ce8868a4a1ccbe2f3f746d864f61a206.jpg")
      .setTimestamp()
      .addField("!help", "Sends this Help Message")
      .addField("ping/pong", "Send ping or pong to test if the bot is listening")
      //.addField("!live", "Sends out a fancy live message if you are a registered streamer")
      .addField("!m8status", "Sends a status report of the bot");
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
           if (beamInfo.online == false){
             msg.channel.sendMessage(beam + " is not live right now.");
           }
           if (beamInfo.online == true){
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
               client.channels.get(serversAllowed[i]).sendEmbed(liveEmbed, "@here");
             }
           }
         }
     });
    }
  }

});

var token = fs.readFileSync("./token.txt", "utf-8");

client.login(token);
