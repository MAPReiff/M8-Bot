const settings = require('../settings.json');
exports.run = (client, message, params) => {
  message.delete();
  const permission = client.elevation(message);
  const commandNames = Array.from(client.commands.keys());
  const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
  if (!params[0]) {
    message.channel.send(`My commands are:\n\n[Use ${settings.prefix}cmds <commandname> for details]\n
      \n${client.commands.filter(cmd => cmd.conf.permLevel <= permission).map(c => `${settings.prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}`).join('\n')}`, {code: 'asciidoc'});
  } else {
    let command = params[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      message.channel.send(`= ${command.help.name} = \n${command.help.description}\nUsage:: ${command.help.usage}`, {
        code: 'asciidoc'
      });
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['c', 'commands', 'help', 'help m8bot'],
  permLevel: 0
};

exports.help = {
  name: 'cmds',
  description: 'Displays all the available commands for your permission level.',
  usage: 'cmds [command]',
};
