//Invite link https://discordapp.com/oauth2/authorize?client_id=278362996349075456&scope=bot&permissions=37223488

var version = "v0.9.1";
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
  client.user.setGame(version);
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
        //  const hook = new Discord.WebhookClient(hookID[0], hookID[1]);
        //  hook.sendMessage(beamInfo.token + " last updated " + diff);
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
  if (msg.content == "!rawr"){
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
    if (fs.existsSync("./servers/" + chatID + ".txt")){
      var owner = msg.guild.ownerID;
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
      .addField("!help", "Sends this Help Message")
      .addField("ping/pong", "Send ping or pong to test if the bot is listening")
      //.addField("!live", "Sends out a fancy live message if you are a registered streamer")
      .addField("!m8status", "Sends a status report of the bot")
      .addField("!me", "Sends user info about themself")
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
  if (msg.content == "!server"){
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

});

var token = fs.readFileSync("./token.txt", "utf-8");

client.login(token);
