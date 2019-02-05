const {
    Command
} = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'slap',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 0,
            deletable: false,
            bucket: 1,
            aliases: ['batslap'],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
            requiredSettings: [],
            subcommands: false,
            description: 'Get a bat slap image.',
            quotedStringSupport: false,
            // usage: '',
            usageDelim: undefined,
            extendedHelp: 'No extended help available.'
        });
    }

    async run(message, [...params]) {

        const {
            MessageAttachment
        } = require("discord.js");

        if (message.mentions.users.size >= 1) {
            var target = message.mentions.users.first()
        } else {
            return message.reply("please tag who you want to slap.")
        }

        let msg
        msg = await message.channel.send(`<a:loading:417323455147540490> Wow, **${target.username}** is about to get messed up...`);

        await message.channel.send(new MessageAttachment(
            await this.client.idiotAPI.batSlap(message.author.displayAvatarURL({
                    format: "png",
                    size: 128
                }),
                message.mentions.users.first().displayAvatarURL({
                    format: "png",
                    size: 128
                })),
            "batslap.png"));

        await msg.delete();



    }

    async init() {
        /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
    }

};