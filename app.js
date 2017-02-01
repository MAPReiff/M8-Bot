//Invite link https://discordapp.com/oauth2/authorize?client_id=272756283038236673&scope=bot&permissions=37223488

var version = "0.2.4";
var website = "http://comixsyt.space";


const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.username}!`);
  console.log("Version " + version);
});

var fs = require("fs");
var usersRaw = fs.readFileSync("./users.txt", "utf-8");
var users = usersRaw.split(", ");
console.log(users.length + " users");

var chatsRaw = fs.readFileSync("./chats.txt", "utf-8");
var chats = chatsRaw.split(", ");
console.log(chats.length + " chats");

var serverCount = chats.length;
var userCount = users.length;

client.on("message", msg => {
  if (msg.content === "ping") {
    msg.reply("Pong!");
  }
  if (msg.content === "pong") {
    msg.reply("Ping!");
  }
  if (msg.content.startsWith("!live")){
    let args = msg.content.split(" ").slice(1);
    let beam = args[0];
    console.log(msg.author + " sent the live command!")
    var registered = users.includes(msg.author.id);
    if (registered == true){
      var request = require("request");
      request("https://beam.pro/api/v1/channels/" + beam, function (error, response, body) {
        if (!error && response.statusCode == 200) {
           var beamInfo = JSON.parse(body);
           //msg.reply(beamInfo.online);
           if (beamInfo.online == false){
             msg.channel.sendMessage(beam + " is not live right now.")
           }
           if (beamInfo.online == true){
             //msg.channel.sendMessage(beam + " is currently live @ http://beam.pro/" + beam);
             for (i=0; i < chats.length; i++){
               client.channels.get(chats[i]).sendMessage("@here, " + beam + " is live @ http://beam.pro/" + beam);
             }
           }
        }
      });
    }
      else{
        msg.reply("You are not a registered streamer! Please contact ComixsYT to be added.")
      }
    }
  if (msg.content == "!comstatus"){
    msg.channel.sendMessage("**Com Bot Status:** \nVersion - " + version + "\nWebsite - " + website + ".\nThe bot is on " + serverCount + " servers.\nThere are currently " + userCount + " registered streamers.");
  }
  if (msg.content == "!help combot"){
    msg.channel.sendMessage("**Com Bot Commands:** \n!help combot - shows this message \n!live - sends out a live message for streamerrs; command requires a beam username with it \nping - replies pong to test if the bot is online \npong - same as ping (Gam3Pr0 was butthurt about it not existing) \n!comstatus - status info about the bot");
  }
});

client.login("MjcyNzU2MjgzMDM4MjM2Njcz.C2xUHA.RenWSL0Q_wVd6leerg95JQ48q7Y");
