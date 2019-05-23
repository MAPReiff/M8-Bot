const {
    Command,
    RichDisplay
} = require('klasa')

module.exports = class extends Command {
	constructor (...args) {
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
			permissionLevel: 5, // any one with admin perms
			requiredPermissions: [],
			requiredSettings: ['mixerLiveChannel'],
			subcommands: false,
			description: 'Used to add a Mixer streamer to your server.',
			quotedStringSupport: false,
			usageDelim: undefined
		})
	}

	async run (message, [...params]) {
		const fs = require('fs')
		const fetch = require('node-fetch')

		var prefix = message.guild.settings.prefix
		var args = message.content.toString().toLowerCase().replace(prefix + 'addmixer', '').split(' ')
		var streamer = args[1]

		var mixerDir = __dirname.replace('commands/Streaming', 'streamers/mixer').replace(String.raw`\commands\Streaming`, String.raw`\streamers\mixer`)
		var streamerDir = __dirname.replace('commands/Streaming', 'streamers').replace(String.raw`\commands\Streaming`, String.raw`\streamers`)
		var guildID = message.guild.id

		function checkStatus (res) {
			if (res.ok) {
				return res
			} else {
				return message.reply(`There is no registered Mixer account with the name ${streamer}`)
			}
		}

		function liveMixer (name, game, status, logo, followers, views, level, id) {
			var mixerDir = './streamers/mixer'
			const Discord = require('discord.js')
			const {
				MessageEmbed
			} = require('discord.js')
			require('discord.js-aliases')
			const fs = require('fs')

			const liveEmbed = new Discord.MessageEmbed() // start the embed message template
				.setTitle(name + "'s Stream")
				.setAuthor(status)
				.setColor(0x9900FF)
				.setDescription('Hey guys, ' + name + ' is live on Mixer right now! Click above to watch!')
				.setFooter('Sent via M8 Bot', 'http://m8bot.js.org/img/profile.png')
				.setThumbnail(logo)
				.setTimestamp()
				.setURL('http://mixer.com/' + name)
				.addField('Streaming', game)
				.addField('Followers', followers, true)
				.addField('Mixer Level', level, true)
				.addField('Total Views', views, true) // end the embed message template

			var serversAllowedRaw = fs.readFileSync(mixerDir + '/' + id + '.json')
			var streamerData = JSON.parse(serversAllowedRaw)
			var serversAllowed = streamerData.guilds.toString().split(',')

			var mi
			for (mi = 0; mi < serversAllowed.length; mi++) { // run for the total number of servers they are allowed on
				if (this.guilds.map(c => c.id).includes(serversAllowed[mi])) {
					var guildId = serversAllowed[mi]

					if (this.guilds.get(guildId) !== undefined) {
						var gSettings = this.guilds.get(guildId).settings

						if (gSettings.mixerLiveChannel !== undefined) {
							var channelID = gSettings.mixerLiveChannel

							if (channelID == null) {
								channelID = this.guilds.get(guildId).channels.find(channel => channel.name === 'general').id
								var liveMessage = ''

								if (gSettings.livePing) {
									liveMessage = liveMessage + '@here, '
								}

								liveMessage = liveMessage + name + ' is now live on Mixer!'

								this.channels.get(channelID).sendEmbed(liveEmbed, liveMessage) // send the live message to servers
							} else {
								liveMessage = ''

								if (gSettings.livePing) {
									liveMessage = liveMessage + '@here, '
								}

								liveMessage = liveMessage + name + ' is now live on Mixer!'

								this.channels.get(channelID).sendEmbed(liveEmbed, liveMessage) // send the live message to servers
							}
						}
					}
				}
			}
		}

		fetch(`https://mixer.com/api/v1/channels/${streamer}`)
			.then(checkStatus)
			.then(res => res.json())
			.then(
				mixerInfo => {
					const mixerID = mixerInfo.id
					if (!fs.existsSync(mixerDir + '/' + mixerID + '.json')) { // if they are not in the database
						let defaultMixer = {
							name: mixerInfo.token,
							id: mixerInfo.id,
							userid: mixerInfo.userid,
							liveTime: '0',
							guilds: [message.guild.id]
						}
						let mixerJSON = JSON.stringify(defaultMixer)
						fs.writeFileSync(mixerDir + '/' + mixerID + '.json', mixerJSON)

						var curMixer = fs.readFileSync(streamerDir + '/mixerStreamers.txt', 'utf-8')
						var newMixer = mixerID + ', ' + curMixer

						fs.writeFileSync(streamerDir + '/mixerStreamers.txt', newMixer)

						const Carina = require('carina').Carina
						const ws = require('ws')

						Carina.WebSocket = ws
						const ca = new Carina({
							isBot: true
						}).open()

						class MixerJSONF {
							constructor (id) {
								var rawdata = fs.readFileSync(mixerDir + '/' + id + '.json')
								this.streamerData = JSON.parse(rawdata)
							}
						}

						var halfHour = 1800000 // time in milis that is 30min

						ca.subscribe(`channel:${mixerID}:update`, data => { // subscribing to the streamer
							if (data.online === true && data.updatedAt !== undefined) {
								var mixerStatus = data.online // checks if they are online (its a double check just incase the above line miss fires)
								if (mixerStatus === true) { // if the info JSON says they are live
									var liveTime = (new Date()).getTime() // time the bot sees they went live
									var mixerId = mixerID.toString()
									var mixerD = new MixerJSONF(mixerId)
									var lastLiveTime = mixerD.streamerData.liveTime
									var timeDiff = liveTime - lastLiveTime // gets the diff of current and last live times

									if (timeDiff >= halfHour) { // if its been 30min or more
										var args = [mixerInfo.token, mixerInfo.type.name, mixerInfo.name, mixerInfo.user.avatarUrl, mixerInfo.numFollowers, mixerInfo.viewersTotal, mixerInfo.user.level, mixerInfo.id]
										this.client.shard.broadcastEval(`(${liveMixer}).apply(this, ${JSON.stringify(args)})`)

										if (mixerInfo.token === mixerD.streamerData.name) {
											mixerD.streamerData.liveTime = liveTime
											fs.writeFileSync(mixerDir + '/' + mixerID + '.json', JSON.stringify(mixerD.streamerData))
										} else {
											mixerD.streamerData.name = mixerInfo.token
											mixerD.streamerData.liveTime = liveTime
											fs.writeFileSync(mixerDir + '/' + mixerID + '.json', JSON.stringify(mixerD.streamerData))
										}
									}
								}
							}
						})

						return message.reply(`you have added ${mixerInfo.token} on Mixer to your server!`)
					}
					if (fs.existsSync(mixerDir + '/' + mixerID + '.json')) { // if they are in the database
						let rawdata = fs.readFileSync(mixerDir + '/' + mixerID + '.json')
						let streamerData = JSON.parse(rawdata)
						if (streamerData.guilds.includes(guildID)) { // if they are already added to that server
							return message.reply(`the Mixer streamer ${mixerInfo.token} has already been added to your server!`)
						}
						if (!streamerData.guilds.includes(guildID)) { // if they are not already added to that server
							var oldGuilds = streamerData.guilds
							oldGuilds.push(guildID)
							streamerData.guilds = oldGuilds

							fs.writeFileSync(mixerDir + '/' + mixerID + '.json', JSON.stringify(streamerData))
							return message.reply(`you have added ${mixerInfo.token} on Mixer to your server!`)
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
