const {
    Command
} = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'addMixer',
            enabled: true,
            runIn: ['text'],
            cooldown: 0,
            deletable: false,
            bucket: 1,
            aliases: [],
            guarded: false,
            nsfw: false,
            permissionLevel: 6, //any one with admin perms
            requiredPermissions: [],
            requiredSettings: ['mixerLiveChannel'],
            subcommands: false,
            description: 'Used to add a Mixer streamer to your server.',
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
        var args = message.content.toString().toLowerCase().replace(prefix + 'addmixer', '').split(' ')
        var streamer = args[1]
        var mixerDir = __dirname.replace("commands/Streaming", "streamers/mixer");
        var guildID = parseInt(message.guild.id)


        function checkStatus(res) {
            if (res.ok) { // res.status >= 200 && res.status < 300
                return res;
            } else {
                return message.reply(`There is no registered Mixer account with the name ${streamer}`)
            }
        }
        fetch(`https://mixer.com/api/v1/channels/${streamer}`)
            .then(checkStatus)
            .then(res => res.json())
            .then(
                mixerInfo => {
                    const mixerID = mixerInfo.id;
                    if (!fs.existsSync(mixerDir + '/' + mixerID + '.json')) { //if they are not in the database
                        let defaultMixer = {
                            name: mixerInfo.token,
                            id: mixerInfo.id,
                            userid: mixerInfo.userid,
                            liveTime: '0',
                            guilds: [parseInt(message.guild.id)]
                        };
                        let mixerJSON = JSON.stringify(defaultMixer);
                        fs.writeFileSync(mixerDir + '/' + mixerID + '.json', mixerJSON);

                        return message.reply(`you have added ${mixerInfo.token} on Mixer to your server!`)

                    }
                    if (fs.existsSync(mixerDir + '/' + mixerID + '.json')) { //if they are in the database
                        let rawdata = fs.readFileSync(mixerDir + '/' + mixerID + '.json');
                        let streamerData = JSON.parse(rawdata);
                        if (streamerData.guilds.includes(guildID)) { //if they are already added to that server
                            return message.reply(`the Mixer streamer ${mixerInfo.token} has already been added to your server!`)
                        }
                        if (!streamerData.guilds.includes(guildID)) { //if they are not already added to that server
                            var oldGuilds = streamerData.guilds
                            oldGuilds.push(guildID)
                            streamerData.guilds = oldGuilds

                            fs.writeFileSync(mixerDir + '/' + mixerID + '.json', JSON.stringify(streamerData));
                            return message.reply(`you have added ${mixerInfo.token} on Mixer to your server!`)
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