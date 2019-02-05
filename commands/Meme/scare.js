const {
    Command
} = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'scare',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 0,
            deletable: false,
            bucket: 1,
            aliases: [],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
            requiredSettings: [],
            subcommands: false,
            description: 'Get a scare image.',
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
            var target = message.author;
        }

        let msg
        msg = await message.channel.send(`<a:loading:417323455147540490> ${target.username} is terrifying...`);


        await message.channel.send(new MessageAttachment(
            await this.client.idiotAPI.wreckIt(target.displayAvatarURL({
                format: "png",
                size: 128
            })),
            "wreckIt.png"));


        await msg.delete();




    }

    async init() {
        /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
    }

};