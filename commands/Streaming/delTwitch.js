const {
    Command,
    RichDisplay
} = require('klasa')

module.exports = class extends Command {
	constructor (...args) {
		super(...args, {
			name: 'delTwitch',
			enabled: true,
			runIn: ['text'],
			cooldown: 0,
			deletable: false,
			bucket: 1,
			aliases: [],
			guarded: false,
			nsfw: false,
			permissionLevel: 5, // any one with admin perms
			requiredPermissions: [],
			requiredSettings: [],
			subcommands: false,
			description: 'Used to remove a Twitch streamer to your server.',
			quotedStringSupport: false,
			usageDelim: undefined
		})
	}

	async run (message, [...params]) {
		const fs = require('fs')
		const fetch = require('node-fetch')

		var prefix = message.guild.settings.prefix
		var args = message.content.toString().toLowerCase().replace(prefix + 'deltwitch', '').split(' ')
		var streamer = args[1]
		var twitchDir = __dirname.replace('commands/Streaming', 'streamers/twitch').replace(String.raw`\commands\Streaming`, String.raw`\streamers\twitch`)
		var guildID = message.guild.id
		var twitchId = this.client.config.twitch_id

		function checkStatus (res) {
			if (res.ok) {
				return res
			} else {
				return message.reply(`There is no registered Twitch account with the name ${streamer}`)
			}
		}

		var headers = { 
			'Client-Id': this.client.config.twitch_id,
			'Accept': 'application/vnd.twitchtv.v5+json'
		}

		fetch(`https://api.twitch.tv/kraken/users?login=${streamer}`, { method: 'GET', headers: headers})
			.then(checkStatus)
			.then(res => res.json())
			.then(
				twitchInfo => {
					const name = twitchInfo.users[0].display_name
					if (!fs.existsSync(twitchDir + '/' + name + '.json')) { // if they are not in the database
						return message.reply(`the Twitch streamer ${name} was never added to your server, and thus cannot be removed!`)
					}
					if (fs.existsSync(twitchDir + '/' + name + '.json')) { // if they are in the database
						let rawdata = fs.readFileSync(twitchDir + '/' + name + '.json')
						let streamerData = JSON.parse(rawdata)

						if (streamerData.guilds.includes(guildID)) { // if they are already added to that server
							var oldGuilds = streamerData.guilds
							var index = oldGuilds.indexOf(guildID)
							if (index > -1) {
								oldGuilds.splice(index, 1)
							}
							streamerData.guilds = oldGuilds
							fs.writeFileSync(twitchDir + '/' + name + '.json', JSON.stringify(streamerData))
							return message.reply(`you have removed the Twitch streamer ${name} from your server!`)
						}

						if (!streamerData.guilds.includes(guildID)) { // if they are not already added to that server
							return message.reply(`the Twitch streamer ${name} was never added to your server, and thus cannot be removed!`)
						}
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
