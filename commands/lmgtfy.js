exports.run = (client, message) => {
  message.delete();
  if (message.content.startsWith("!lmgtfy")) {
    var term = message.content.replace("!lmgtfy ", "");
  }
  if (message.content.startsWith("!google")) {
    var term = message.content.replace("!google ", "");
  }
  if (message.content.startsWith("!search")) {
    var term = message.content.replace("!search ", "");
  }
  var spaces = term.split(" ");
  var input = term.replace(" ", "+");
  for (i=0; i < spaces.length; i++){
    var input = input.replace(" ", "+");
  }
  message.channel.send("Here's your google link " + message.author + " - http://lmgtfy.com/?q=" + input);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['google','search'],
  permLevel: 0
};

exports.help = {
  name: 'lmgtfy',
  description: 'Gets a Let Me Google That For You link for any term you want.',
  usage: '!lmgtfy ___'
};
