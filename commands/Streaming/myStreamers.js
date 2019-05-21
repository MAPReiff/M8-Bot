import { Command } from 'klasa'

export default class extends Command {
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
			for (i = 0; i < fileCount; i++) {
				var serverList = fs.readFileSync(userDirMixer + '/' + files[i])
				if (serverList.includes(guildID)) {
					var name = JSON.parse(serverList).name
					myStreamersMixer = myStreamersMixer + name + '\n'
				}
			}
			message.channel.send(myStreamersMixer)

			if (err) {
				console.log(err)
			}
		})

		fs.readdir(userDirTwitch, (err, files) => {
			var fileCount = files.length
			var myStreamersTwitch = 'Current **Twitch** Streamer List:\n'
			var ip

			for (ip = 0; ip < fileCount; ip++) {
				var serverList = fs.readFileSync(userDirTwitch + '/' + files[ip])
				if (serverList.includes(guildID)) {
					var name = files[ip].replace('.json', '')
					myStreamersTwitch = myStreamersTwitch + name + '\n'
				}
			}

			message.channel.send(myStreamersTwitch)

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
