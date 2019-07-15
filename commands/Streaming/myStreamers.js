const {
    Command,
    RichDisplay
} = require('klasa')

module.exports = class extends Command {
	constructor (...args) {
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
			permissionLevel: 5,
			requiredPermissions: [],
			requiredSettings: [],
			subcommands: false,
			description: 'Lists streamers added to your server.',
			quotedStringSupport: false,
			usageDelim: undefined
		})
	}

	async run (message, [...params]) {
		var userDirMixer = __dirname.replace('commands/Streaming', 'streamers/mixer').replace(String.raw`\commands\Streaming`, String.raw`\streamers\mixer`)
		var userDirTwitch = __dirname.replace('commands/Streaming', 'streamers/twitch').replace(String.raw`\commands\Streaming`, String.raw`\streamers\twitch`)
		const fs = require('fs')
		var guildID = message.guild.id

		fs.readdir(userDirMixer, (err, files) => {
			var fileCount = files.length
			var myStreamersMixer = 'Current **Mixer** Streamer List:\n'
			var i
			var mixerNum = 0
			for (i = 0; i < fileCount; i++) {
				var serverList = fs.readFileSync(userDirMixer + '/' + files[i])
				if (serverList.includes(guildID)) {
					var name = JSON.parse(serverList).name
					myStreamersMixer = myStreamersMixer + name + '\n'
					mixerNum = mixerNum + 1
				}
			}

			if (mixerNum >> 0) {
				message.channel.send(myStreamersMixer)
			}
			else{
				message.channel.send('There are currently no Mixer Streamers setup in this server.')
			}

			if (err) {
				console.log(err)
			}
		})

		fs.readdir(userDirTwitch, (err, files) => {
			var fileCount = files.length
			var myStreamersTwitch = 'Current **Twitch** Streamer List:\n'
			var ip
			var twitchNum = 0

			for (ip = 0; ip < fileCount; ip++) {
				var serverList = fs.readFileSync(userDirTwitch + '/' + files[ip])
				if (serverList.includes(guildID)) {
					var name = files[ip].replace('.json', '')
					myStreamersTwitch = myStreamersTwitch + name + '\n'
					twitchNum = twitchNum + 1
				}
			}

			if (twitchNum >> 0) {
				message.channel.send(myStreamersTwitch)
			}
			else{
				message.channel.send('There are currently no Twitch Streamers setup in this server.')
			}

			if (err) {
				console.log(err)
			}
		})
	}

	async init () {
		/*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
	}
}
