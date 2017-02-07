//Invite link https://discordapp.com/oauth2/authorize?client_id=272756283038236673&scope=bot&permissions=37223488

var version = "0.5.0";
var website = "http://comixsyt.space";

var fs = require("fs");

const Discord = require("discord.js");
const client = new Discord.Client();


client.on("ready", () => {
  console.log(`Logged in as ${client.user.username}!`);
  console.log("Version " + version);
  serverCount = client.guilds.size;
  userCount = client.users.size
  console.log("Bot is on " + serverCount + " servers!");
  console.log("Those " + serverCount + " servers have a total of " + userCount + " members!");
});

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
    msg.reply("You need to specify a streamer's discord ID. For example '!add-streamer STREAMER_ID'.");
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
             const NAME = new Discord.RichEmbed()
               .setTitle(beam + "\'s Stream")
               .setAuthor(beam)
               .setColor(128, 0, 128)
               .setDescription("Hey guys, " + beam + " is live right now! Click above to watch!")
               .setFooter("Sent via Com Bot", "https://github.com/MAPReiff/Discord-Bot")
               .setThumbnail(beamInfo.user.avatarUrl)
               .setTimestamp()
               .setURL("http://beam.pro/" + beam)
               .addField("Streaming", game, true)
               .addField("Followers", beamInfo.numFollowers, true)
             var serversAllowedRaw = fs.readFileSync("./users/" + msg.author.id + ".txt", "utf-8");
             var serversAllowed = serversAllowedRaw.split(", ");
             for (i=0; i < serversAllowed.length; i++){
               //client.channels.get(serversAllowed[i]).sendMessage("@here, " + beam + " is live @ http://beam.pro/" + beam + " & is streaming " + beamInfo.type.name + "!");
               //client.channels.get(serversAllowed[i]).sendMessage("@here");
               client.channels.get(serversAllowed[i]).sendEmbed(NAME, "@here");
             }
           }
         }
         });
       }
       else{
         msg.reply("You are not a registered streamer! Please contact ComixsYT to be added.");
       }
     }
  if (msg.content == "!comstatus"){
    msg.delete(1000);
    msg.channel.sendMessage("**Com Bot Status:** \nVersion - " + version + "\nWebsite - " + website +
                "\nThe Bot is on " + serverCount + " servers! \nIn total, those " + serverCount +
                " servers have a total of " + userCount + " users, wow!");
  }
  if (msg.content == "!help combot"){
    msg.delete(1000);
    msg.channel.sendMessage("**Com Bot Commands:** \n!help combot - shows this message \n!live - sends out a live message for streamerrs; command requires a beam username with it \nping - replies pong to test if the bot is online \npong - same as ping (Gam3Pr0 was butthurt about it not existing) \n!comstatus - status info about the bot");
  }
});

var token = fs.readFileSync("./token.txt", "utf-8");

client.login(token);
