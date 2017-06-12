exports.run = (client, message, args) => {
  message.delete();
  if ((message.author.id !== "145367010489008128")||(message.author.id !== "161556067954720768")) return;
    try {
      var code = args.join(" ");
      var evaled = eval(code);

      if (typeof evaled !== "String")
        evaled = require("util").inspect(evaled);
      message.channel.send(clean(evaled), {
        code: true
      });
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`x1\n${clean(err)}\n\`\`\``, {
        code: true
      });
    }
  };

  function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return text;
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 4
};

exports.help = {
  name: 'eval',
  description: 'Eval Command for (Owner).',
  usage: 'eval'
};
