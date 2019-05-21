var version = '12.9.1'

const {
	KlasaClient,
	Schema
} = require('klasa')

const Discord = require('discord.js')
const {
	MessageEmbed
} = require('discord.js')
require('discord.js-aliases')

const fs = require('fs')

const config = require('./config.js')

const client = new KlasaClient({
	prefix: config.prefix,
	providers: {
		default: 'rethinkdb'
	},
	ownerID: '93015586698727424',
	fetchAllMembers: false,
	commandEditing: true,
	typing: true,
	readyMessage: (client) => `Successfully initialized. Ready to serve ${client.guilds.size} guilds.`
})

client.config = require('./config.js')

const Idiot = require('idiotic-api')
client.idiotAPI = new Idiot.Client(client.config.idiotKey, {
	dev: true
})

client.version = version

client.on('ready', () => {
	client.user.setActivity(`v${version} | m8bot.js.org`)
})

const DBL = require('dblapi.js')
const dbl = new DBL(client.config.discordbots_org, client)

KlasaClient.defaultGuildSchema.add('mixerLiveChannel', 'TextChannel')
KlasaClient.defaultGuildSchema.add('twitchLiveChannel', 'TextChannel')
KlasaClient.defaultGuildSchema.add('modLog', 'TextChannel')
KlasaClient.defaultGuildSchema.add('welcomeChannel', 'TextChannel')
KlasaClient.defaultGuildSchema.add('livePing', 'Boolean', {
	default: true
})
KlasaClient.defaultGuildSchema.add('defaultRole', 'role')
KlasaClient.defaultGuildSchema.add('muted', 'role')
KlasaClient.defaultGuildSchema.add('mod', 'role')
KlasaClient.defaultClientSchema.add('points', 'float', {
	default: 10
})

KlasaClient.defaultPermissionLevels
// Mods are lvl5
	.add(5, ({
		guild,
		member
	}) => guild && guild.settings.mod != null && member.roles.has(guild.settings.mod))
// Support are lvl8
	.add(8, ({
		client,
		author
	}) => client.config.botSupportTeam.includes(author.id), {
		fetch: true
	})

client.login(client.config.token)

const streamerFolderMixer = './streamers/mixer'
const streamerFolderTwitch = './streamers/twitch'
const streamerFolder = './streamers'
const delay = require('delay')
const chalk = require('chalk')
const fetch = require('node-fetch')

var halfHour = 1800000 // 30 min in ms

function checkStatus (res) {
	if (res.ok) {
		return res
	} else {
		// nothing
	}
}

function loadStreamers () {
	fs.readdir(streamerFolderMixer, (err, files) => {
		var fileCount = files.length
		var allMixer = ''
		for (var i = 0; i < fileCount; i++) {
			var name = files[i].replace('.json', ', ')
			allMixer = allMixer + name
		}
		fs.writeFileSync(streamerFolder + '/mixerStreamers.txt', allMixer.replace('.DS_Store', ''))

		if (err) {
			console.log(err)
		}
	})

	fs.readdir(streamerFolderTwitch, (err, files) => {
		var fileCount = files.length
		var allTwitch = ''
		for (var i = 0; i < fileCount; i++) {
			var name = files[i].replace('.json', ', ')
			allTwitch = allTwitch + name
		}
		fs.writeFileSync(streamerFolder + '/twitchStreamers.txt', allTwitch.replace('.DS_Store', ''))

		if (err) {
			console.log(err)
		}
	})
}

// Start Twitch
var streamersTwitch = fs.readFileSync(streamerFolder + '/twitchStreamers.txt', 'utf-8').split(', ')
var streamerCountTwitch = streamersTwitch.length
console.log(chalk.magenta(`Now stalking ${streamerCountTwitch} streamers on Twitch!`))

function twitchCheck() {
	console.log(chalk.magenta('Checking Twitch!'))
	for (var tc = 0; tc < streamersTwitch.length; tc++) {
		var liveTime = (new Date()).getTime()

		if (streamersTwitch[tc] !== '') {
			var rawdata = fs.readFileSync(streamerFolderTwitch + '/' + streamersTwitch[tc] + '.json')
			var streamerData = JSON.parse(rawdata)
			var lastLiveTime = streamerData.liveTime

			var timeDiff = liveTime - lastLiveTime
			if (timeDiff >= halfHour) {
				fetch(`https://api.twitch.tv/kraken/streams/${streamersTwitch[tc]}/?client_id=${client.config.twitch_id}`)
					.then(checkStatus)
					.then(res => res.json())
					.then(twitchInfo => {
						if (twitchInfo.stream != null) {
							var liveTime = (new Date()).getTime()
							var streamStartTime = new Date(twitchInfo.stream.created_at)
							var streamStartMS = streamStartTime.getTime()
							if (liveTime - streamStartMS < 1800000) {
								console.log(chalk.magenta(twitchInfo.stream.channel.name + ' went live on Twitch, as its been more than 30min!'))

								if (twitchInfo.stream.game === '') {
									var gameName = '[API ERROR]'
									var args = [twitchInfo.stream.channel.name, gameName, twitchInfo.stream.channel.status, twitchInfo.stream.channel.logo, twitchInfo.stream.channel.followers, twitchInfo.stream.channel.views]
									var v = JSON.stringify(args)

									client.shard.broadcastEval(`(${liveTwitch}).apply(this, ${JSON.stringify(args)})`)
									streamerData.liveTime = liveTime
									fs.writeFileSync(streamerFolderTwitch + '/' + twitchInfo.stream.channel.name + '.json', JSON.stringify(streamerData))
								} else {
									// client.shard.broadcastEval(liveTwitch(twitchInfo.stream.channel.name, twitchInfo.stream.game, twitchInfo.stream.channel.status, twitchInfo.stream.channel.logo, twitchInfo.stream.channel.followers, twitchInfo.stream.channel.views)) //should tell all shards to do the following
									var args = [twitchInfo.stream.channel.name, twitchInfo.stream.game, twitchInfo.stream.channel.status, twitchInfo.stream.channel.logo, twitchInfo.stream.channel.followers, twitchInfo.stream.channel.views]
									var v = JSON.stringify(args)
									client.shard.broadcastEval(`(${liveTwitch}).apply(this, ${JSON.stringify(args)})`)
									streamerData.liveTime = liveTime
									fs.writeFileSync(streamerFolderTwitch + '/' + twitchInfo.stream.channel.name + '.json', JSON.stringify(streamerData))
								}
							}
						}
					})
			}
		}
	}
}

function liveTwitch (name, game, status, logo, followers, views) {
	var twitchDir = './streamers/twitch'
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
		.setDescription('Hey guys, ' + name + ' is live on Twitch right now! Click above to watch!')
		.setFooter('Sent via M8 Bot', 'http://m8bot.js.org/img/profile.png')
		.setThumbnail(logo)
		.setTimestamp()
		.setURL('http://twitch.tv/' + name)
		.addField('Streaming', game)
		.addField('Followers', followers, true)
		.addField('Total Views', views, true) // end the embed message template

	var serversAllowedRaw = fs.readFileSync(twitchDir + '/' + name + '.json')
	var streamerData = JSON.parse(serversAllowedRaw)
	var serversAllowed = streamerData.guilds.toString().split(',')

	var i
	for (i = 0; i < serversAllowed.length; i++) { // run for the total number of servers they are allowed on
		if (this.guilds.map(c => c.id).includes(serversAllowed[i])) {
			var guildId = serversAllowed[i]

			if (this.guilds.get(guildId) !== undefined) {
				var gSettings = this.guilds.get(guildId).settings

				if (gSettings.twitchLiveChannel !== undefined) {
					var channelID = gSettings.twitchLiveChannel

					if (channelID == null) {
						channelID = this.guilds.get(guildId).channels.find(channel => channel.name === 'general').id
						if (channelID === undefined) {
							return
						}
						var liveMessage = ''

						if (gSettings.livePing) {
							liveMessage = liveMessage + '@here, '
						}

						liveMessage = liveMessage + name + ' is now live on Twitch!'

						this.channels.get(channelID).sendEmbed(liveEmbed, liveMessage)
					} else {
						var liveMessage = ''

						if (gSettings.livePing) {
							liveMessage = liveMessage + '@here, '
						}

						liveMessage = liveMessage + name + ' is now live on Twitch!'

						this.channels.get(channelID).sendEmbed(liveEmbed, liveMessage) // send the live message to servers
					}
				}
			}
		}
	}
}

// Start Mixer
var streamersMixer = fs.readFileSync(streamerFolder + '/mixerStreamers.txt', 'utf-8').split(', ')
var mixerStreamerCount = streamersMixer.length

const Carina = require('carina').Carina
const ws = require('ws')

Carina.WebSocket = ws
const ca = new Carina({
	isBot: true
}).open()

class MixerJSON {
	constructor (id) {
		var rawdata = fs.readFileSync(streamerFolderMixer + '/' + id + '.json')
		this.streamerData = JSON.parse(rawdata)
	}
}

function mixerCheck () {
	for (var i = 0; i < mixerStreamerCount; i++) {
		var halfHour = 1800000 // time in milis that is 30min
		var bootTime = (new Date()).getTime() // get the time the bot booted up
		var halfHourAgo = bootTime - 1800000 // get the time 30min before the boot

		fetch(`https://mixer.com/api/v1/channels/${streamersMixer[i]}`)
			.then(checkStatus)
			.then(res => res.json())
			.then(mixerInfo => {
				var mixerID = mixerInfo.id

				ca.subscribe(`channel:${mixerID}:update`, data => { // subscribing to the streamer
					if (data.online === true && data.updatedAt !== undefined) {
						var mixerStatus = data.online // checks if they are online (its a double check just incase the above line miss fires)
						if (mixerStatus === true) { // if the info JSON says they are live
							var liveTime = (new Date()).getTime() // time the bot sees they went live
							var mixerId = mixerID.toString()
							var mixerD = new MixerJSON(mixerId)
							var lastLiveTime = mixerD.streamerData.liveTime
							var timeDiff = liveTime - lastLiveTime // gets the diff of current and last live times

							if (timeDiff >= halfHour) { // if its been 30min or more
								var args = [mixerInfo.token, mixerInfo.type.name, mixerInfo.name, mixerInfo.user.avatarUrl, mixerInfo.numFollowers, mixerInfo.viewersTotal, mixerInfo.user.level, mixerInfo.id]
								var v = JSON.stringify(args)
								client.shard.broadcastEval(`(${liveMixer}).apply(this, ${JSON.stringify(args)})`)

								if (mixerInfo.token === mixerD.streamerData.name) {
									mixerD.streamerData.liveTime = liveTime
									fs.writeFileSync(streamerFolderMixer + '/' + mixerID + '.json', JSON.stringify(mixerD.streamerData))
								} else {
									mixerD.streamerData.name = mixerInfo.token
									mixerD.streamerData.liveTime = liveTime
									fs.writeFileSync(streamerFolderMixer + '/' + mixerID + '.json', JSON.stringify(mixerD.streamerData))
								}
							}
						}
					}
				})
			})
	}

	console.log(chalk.cyan(`Now stalking ${mixerStreamerCount} streamers on Mixer`)) // logs that the bot is watching for the streamer to go live
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
						var liveMessage = ''

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

if (client.shard.id === 0) { // only the main/first shard
	// loadStreamers()

	// delay(30000).then(() => {
	// 	mixerCheck()
	// })

	// delay(60000).then(() => {
	// 	twitchCheck()
	// })

	// setInterval(twitchCheck, 120000) // run the check every 2min
}
