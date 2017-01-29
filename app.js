
const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
  if (msg.content == "!live"){
    if (msg.author.id == "145367010489008128"){
        msg.channel.sendMessage('Hey @here, Comixs is live! http://beam.pro/comixsty, http://twitch.tv/comixsty & http://gaming.youtube.com/c/CoolComixs/live!');
    }
    else {
      msg.reply('You are not a registered streamer! If you wish for your stream to be added, please message Comixs!');
    }
  }
});

client.login('MjcyNzU2MjgzMDM4MjM2Njcz.C2xUHA.RenWSL0Q_wVd6leerg95JQ48q7Y');
