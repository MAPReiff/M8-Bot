const {
    Command
} = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'addTwitch',
            enabled: true,
            runIn: ['text'],
            cooldown: 0,
            deletable: false,
            bucket: 1,
            aliases: [],
            guarded: false,
            nsfw: false,
            permissionLevel: 5, //any one with admin perms
            requiredPermissions: [],
            requiredSettings: ['twitchLiveChannel'],
            subcommands: false,
            description: 'Used to add a Twitch streamer to your server.',
            quotedStringSupport: false,
            // usage: '',
            usageDelim: undefined
            // extendedHelp: 'No extended help available.'
        });
    }

    async run(message, [...params]) {
        // This is where you place the code you want to run for your command
        const fs = require('fs')
        const fetch = require('node-fetch')

        var prefix = message.guild.settings.prefix
        var args = message.content.toString().toLowerCase().replace(prefix + 'addtwitch', '').split(' ')
        var streamer = args[1]

        var twitchDir = __dirname.replace("commands/Streaming", "streamers/twitch").replace(String.raw`\commands\Streaming`, String.raw`\streamers\twitch`)
        var streamerDir = __dirname.replace("commands/Streaming", "streamers").replace(String.raw`\commands\Streaming`, String.raw`\streamers`);
        var guildID = message.guild.id
        var twitch_id = this.client.config.twitch_id

        function twitchJSON(id) {

            var rawdata = fs.readFileSync(twitchDir + "/" + id + ".json");
            this.streamerData = JSON.parse(rawdata);

            // return streamerData;
        }

        function checkStatus(res) {
            if (res.ok) { // res.status >= 200 && res.status < 300
                return res;
            } else {
                return message.reply(`There is no registered Twitch account with the name ${streamer}`)
            }
        }
        fetch(`https://api.twitch.tv/kraken/channels/${streamer}/?client_id=${twitch_id}`)
            .then(checkStatus)
            .then(res => res.json())
            .then(
                twitchInfo => {
                    var name = twitchInfo.name;
                    if (!fs.existsSync(twitchDir + '/' + name + '.json')) { //if they are not in the database
                        let defaultTwitch = {
                            name: twitchInfo.name,
                            liveTime: '0',
                            guilds: [message.guild.id]
                        };
                        let twitchJSON = JSON.stringify(defaultTwitch);
                        fs.writeFileSync(twitchDir + '/' + name + '.json', twitchJSON);

                        var curTwitch = fs.readFileSync(streamerDir + '/twitchStreamers.txt', "utf-8")
                        var newTwitch = name + ', ' + curTwitch

                        fs.writeFileSync(streamerDir + '/twitchStreamers.txt', newTwitch)

                        return message.reply(`you have added ${name} on Twitch to your server!`)




                    }
                    if (fs.existsSync(twitchDir + '/' + name + '.json')) { //if they are in the database

                        var twitchD = new twitchJSON(name)

                        // let rawdata = fs.readFileSync(twitchDir + '/' + name + '.json');
                        let streamerData = twitchD.streamerData
                        if (streamerData.guilds.includes(guildID)) { //if they are already added to that server
                            return message.reply(`the Twitch streamer ${name} has already been added to your server!`)
                        }
                        if (!streamerData.guilds.includes(guildID)) { //if they are not already added to that server
                            var oldGuilds = streamerData.guilds
                            oldGuilds.push(guildID)
                            streamerData.guilds = oldGuilds

                            fs.writeFileSync(twitchDir + '/' + name + '.json', JSON.stringify(streamerData));
                            return message.reply(`you have added ${name} on Twitch to your server!`)
                        }
                    }
                })







    }

    async init() {
        /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
    }

};