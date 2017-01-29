
const Discord = require("discord.js");
const client = new Discord.Client();

var request = require('request');
request('https://beam.pro/api/v1/channels/comixsyt', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    //console.log(body) // Show the HTML for the Google homepage.
    var json = JSON.parse(body);
    //console.log(json.online);
  }
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
});



client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
  if (msg.content == "!live"){
    if (msg.author.id == "145367010489008128"){
    //  msg.channel.sendMessage(channel, "Hello");
    client.channels.get('275344557674201089').sendMessage('A message to a maybe different channel.');
        //msg.channel.sendMessage('Hey @here, Comixs is live! http://beam.pro/comixsty, http://twitch.tv/comixsty & http://gaming.youtube.com/c/CoolComixs/live!');
    }
    else {
      msg.reply('You are not a registered streamer! If you wish for your stream to be added, please message Comixs!');
    }
  }


});

client.login('MjcyNzU2MjgzMDM4MjM2Njcz.C2xUHA.RenWSL0Q_wVd6leerg95JQ48q7Y');
