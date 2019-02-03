const {
    Command
} = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'myStreamers',
            enabled: true,
            runIn: ['text'],
            cooldown: 0,
            deletable: false,
            bucket: 1,
            aliases: [],
            guarded: false,
            nsfw: false,
            permissionLevel: 6,
            requiredPermissions: [],
            requiredSettings: [],
            subcommands: false,
            description: 'Lists streamers added to your server.',
            quotedStringSupport: false,
            // usage: '',
            usageDelim: undefined,
            // extendedHelp: ''
        });
    }

    async run(message, [...params]) {
        // This is where you place the code you want to run for your command

        var userDirMixer = __dirname.replace("commands/Streaming", "streamers/mixer");
        var userDirTwitch = __dirname.replace("commands/Streaming", "streamers/twitch");
        const fs = require("fs");
        var guildID = message.guild.id

        fs.readdir(userDirMixer, (err, files) => {
            files.forEach(file => {
                var files = file;
            });
            var fileCount = files.length;
            var myStreamersMixer = "Current **Mixer** Streamer List:\n";
            for (i = 0; i < fileCount; i++) {
                var serverList = fs.readFileSync(userDirMixer + "/" + files[i]);
                if (serverList.includes(guildID)) {
                    var name = JSON.parse(serverList).name
                    // var name = files[i].replace(".json", "");
                    var myStreamersMixer = myStreamersMixer + name + "\n";
                }
            }
            message.channel.send(myStreamersMixer);
        });



        fs.readdir(userDirTwitch, (err, files) => {
            files.forEach(file => {
                var files = file;
            });
            var fileCount = files.length;
            var myStreamersTwitch = "Current **Twitch** Streamer List:\n";
            for (i = 0; i < fileCount; i++) {
                var serverList = fs.readFileSync(userDirTwitch + "/" + files[i]);
                if (serverList.includes(guildID)) {
                    var name = files[i].replace(".json", "");
                    var myStreamersTwitch = myStreamersTwitch + name + "\n";
                }
            }
            message.channel.send(myStreamersTwitch);
        });



    }

    async init() {
        /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
    }

};