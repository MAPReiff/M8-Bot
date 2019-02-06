const {
    Command
} = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'kick',
            enabled: true,
            runIn: ['text'],
            cooldown: 0,
            deletable: false,
            bucket: 1,
            aliases: [],
            guarded: false,
            nsfw: false,
            permissionLevel: 6,
            requiredPermissions: ['KICK_MEMBERS'],
            // requiredSettings: ['modLog'],
            subcommands: false,
            description: 'Kicks a user from the server.',
            quotedStringSupport: false,
            // usage: '',
            usageDelim: undefined,
            extendedHelp: 'No extended help available.'
        });
    }

    async run(message, [...params]) {
        const Discord = require("discord.js");
        const {
            MessageEmbed
        } = require('discord.js');
        require('discord.js-aliases');

        const settings = message.guild.settings

        const person = message.content.replace(settings.prefix, "").split(" ").slice(1)
        var reason = message.content.replace(settings.prefix, "").replace(person[0], "").replace('kick ', "")

        if (message.mentions.users.size == 0) return message.reply("you must provide a mention in order to use this command.");
        const user = message.mentions.users.first();
        if (user === message.member) return message.reply("are you sure about that? You cant kick yourself.");
        if (user === message.guild.owner) return message.reply("I have stopped you from starting a military uprising, you can't kick the server owner!");
        if (user.kickable == false) return message.reply("that member could not be kicked, please make sure that the M8 Bot role is higher than the users highest role and has permission to kick users.");

        await message.guild.members.get(user.id).kick(message.author.tag + " kicked via M8 Bot").catch(err => {
            return message.reply("unable to kick the user, please try again later."), console.log(err);
        });

        if (reason == ""){
            reason = 'undefined'
        }

        const kickEmbed = new Discord.MessageEmbed()
            .setAuthor("M8 Bot Moderation")
            .addField("Kicked User", `${user} (${user.tag})`)
            .addField("Moderator", `${message.author} (${message.member.user.tag})`)
            .addField("Reason", reason)
            .setFooter("Sent via M8 Bot", "http://m8bot.js.org/img/profile.png")
            .setThumbnail(user.displayAvatarURL())
            .setColor(0x9900FF);

        message.channel.send({
            embed: kickEmbed
        });

        if (settings.modLog != null) {
            message.guild.channels.get(settings.modLog).send({
                embed: kickEmbed
            }).catch(err => console.log(err));
        }



    }

    async init() {
        /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
    }

};