var version = '12.9.1'

const { KlasaClient, Schema } = require('klasa')
const Discord = require('discord.js')
const MessageEmbed = require('discord.js')
const DiscordAliases = require('discord.js-aliases')
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
const delay = require('delay')
const chalk = require('chalk')
const fetch = require('node-fetch')
// const Carina = require('carina').Carina
// const ws = require('ws')
const WebSocket = require('ws');

client.idiotAPI = new Idiot.Client(client.config.idiotKey, {
	dev: true
})

const streamerFolder = './streamers'
const streamerFolderMixer = './streamers/mixer'
const streamerFolderTwitch = './streamers/twitch'
const halfHour = 1800000 // 30 min in ms

function configureKlasa() {
	// Configure default guild schema for Klasa.
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

	// Configure default permissions levels for Klasa.
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
}

function configureClient() {
	// Set the clients version.
	client.version = version

	// Set bot's activity in Discord.
	client.on('ready', () => {
		client.user.setActivity(`v${version} | m8bot.js.org`)
	})
}

function checkStatus(res) {
	if (res.ok) {
		return res
	} else {
		console.log('Status not ok: ' + res);
		// nothing
	}
}

function loadStreamers() {
	fs.readdir(streamerFolderMixer, (err, files) => {
		if (files === undefined) {
			return;
		}

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

		if (files === undefined) {
			return;
		}

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

function twitchCheck() {
	console.log('Initiating Twitch check.')

	var streamersTwitch = fs.readFileSync(streamerFolder + '/twitchStreamers.txt', 'utf-8').split(', ')
	streamersTwitch.pop()

	var count = 0;
	var streamerBatches = [];
	var streamerBatch = [];
	var announced = [];

	for (var tc = 0; tc < streamersTwitch.length; tc++) {
		var rawdata = fs.readFileSync(streamerFolderTwitch + '/' + streamersTwitch[tc] + '.json')
		var liveTime = (new Date()).getTime();
		var streamerData = JSON.parse(rawdata);
		var lastLiveTime = streamerData.liveTime;

		var timeDiff = liveTime - lastLiveTime;
		if (timeDiff >= halfHour) {
			streamerBatch.push(streamersTwitch[tc]);
			count++;
		}

		if (count == 75) {
			streamerBatches.push(streamerBatch.join(','));
			count = 0;
			streamerBatch = [];
		}
	}
	streamerBatches.push(streamerBatch.join(','));

	var streamerIdBatches = [];

	for (var batch = 0; batch < streamerBatches.length; batch++) {
		var url = `https://api.twitch.tv/kraken/users?login=${streamerBatches[batch]}`;
		var headers = {
			'Accept': 'application/vnd.twitchtv.v5+json',
			'Client-Id': client.config.twitch_id,
		}

		fetch(url, { method: 'GET', headers: headers })
			.then(checkStatus)
			.then(res => res.json())
			.then(twitchInfo => {
				var idList = [];

				for (var user = 0; user < twitchInfo.users.length; user++) {
					idList.push(twitchInfo.users[user]._id);
				}

				streamerIdBatches.push(idList.join(','));
				for (var batch = 0; batch < streamerIdBatches.length; batch++) {
					var url = `https://api.twitch.tv/kraken/streams?channel=${streamerIdBatches[batch]}`;
					var headers = {
						'Accept': 'application/vnd.twitchtv.v5+json',
						'Client-Id': client.config.twitch_id,
					}

					fetch(url, { method: 'GET', headers: headers })
						.then(checkStatus)
						.then(res => res.json())
						.then(twitchInfo => {
							for (var stream = 0; stream < twitchInfo.streams.length; stream++) {
								var liveTime = (new Date()).getTime()
								var streamStartTime = new Date(twitchInfo.streams[stream].created_at)
								var streamStartMS = streamStartTime.getTime()

								if (liveTime - streamStartMS < 1800000) {
									if (twitchInfo.streams[stream].game === '') {
										var gameName = '[API ERROR]'
										var channelName = twitchInfo.streams[stream].channel.name;
										var args = [
											twitchInfo.streams[stream].channel.name,
											gameName,
											twitchInfo.streams[stream].channel.status,
											twitchInfo.streams[stream].channel.logo,
											twitchInfo.streams[stream].channel.followers,
											twitchInfo.streams[stream].channel.views]

										delay(5000).then(() => {
											if (!announced.includes(channelName)) {
												console.log(`Announcing ${channelName}`);
												client.shard.broadcastEval(`(${liveTwitch}).apply(this, ${JSON.stringify(args)})`)
												announced.push(channelName);

												var streamerFile = fs.readFileSync(streamerFolderTwitch + '/' + channelName + '.json');
												var goLiveTime = (new Date()).getTime();
												var streamerJson = JSON.parse(streamerFile);
												streamerJson.liveTime = goLiveTime;
												fs.writeFileSync(streamerFolderTwitch + '/' + channelName + '.json', JSON.stringify(streamerJson));
											}
										});
									}
									else {
										var channelName = twitchInfo.streams[stream].channel.name;
										var args = [twitchInfo.streams[stream].channel.name,
										twitchInfo.streams[stream].game,
										twitchInfo.streams[stream].channel.status,
										twitchInfo.streams[stream].channel.logo,
										twitchInfo.streams[stream].channel.followers,
										twitchInfo.streams[stream].channel.views]

										delay(5000).then(() => {
											if (!announced.includes(channelName)) {
												console.log(`Announcing ${channelName}`);
												client.shard.broadcastEval(`(${liveTwitch}).apply(this, ${JSON.stringify(args)})`)
												announced.push(channelName);

												var streamerFile = fs.readFileSync(streamerFolderTwitch + '/' + channelName + '.json');
												var goLiveTime = (new Date()).getTime();
												var streamerJson = JSON.parse(streamerFile);
												streamerJson.liveTime = goLiveTime;
												fs.writeFileSync(streamerFolderTwitch + '/' + channelName + '.json', JSON.stringify(streamerJson));
											}
										});
									}
								}
							}
						});
				}
			});
	}

	console.log('Twitch check completed.')
}

function liveTwitch(name, game, status, logo, followers, views) {
	const streamerFolderTwitch = './streamers/twitch'
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

	var serversAllowedRaw = fs.readFileSync(streamerFolderTwitch + '/' + name + '.json')
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

						try {
							this.channels.get(channelID).sendEmbed(liveEmbed, liveMessage)
						}
						catch (err) {
							console.log(`Error sending message via twitch: ${err}`)
						}

					} else {
						var liveMessage = ''

						if (gSettings.livePing) {
							liveMessage = liveMessage + '@here, '
						}

						liveMessage = liveMessage + name + ' is now live on Twitch!'


						try {
							this.channels.get(channelID).sendEmbed(liveEmbed, liveMessage)
						}
						catch (err) {
							console.log(`Error sending message via twitch: ${err}`)
						}
					}
				}
			}
		}
	}
}

function mixerCheck() {
	for (var i = 0; i < mixerStreamerCount; i++) {
		var halfHour = 1800000 // time in milis that is 30min
		var bootTime = (new Date()).getTime() // get the time the bot booted up
		var halfHourAgo = bootTime - 1800000 // get the time 30min before the boot

		if (streamersMixer[i] == '') {
			continue;
		}

		var mixerID = streamersMixer[i];
		console.log(`Subscribing to ${mixerID}`);
		// var subscribe = "{\"type\": \"method\", \"method\": \"livesubscribe\", \"params\": {\"events\": [\"channel:" + beamId + ":update\"]}, \"id\": " + beamId + "}";
		var subscribe = {
			"type": "method",
			"method": "livesubscribe",
			"params": {
				"events": [`channel:${mixerID}:update`]
			},
			"id:": mixerID
		};

		ws.send(JSON.stringify(subscribe));
	}

	console.log(chalk.cyan(`Now stalking ${mixerStreamerCount} streamers on Mixer`)) // logs that the bot is watching for the streamer to go live
}

function liveMixer(name, game, status, logo, followers, views, level, id) {
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

						var channel = this.channels.get(channelID);
						if (channel !== null) {
							channel.sendEmbed(liveEmbed, liveMessage) // send the live message to servers
						}
					} else {
						var liveMessage = ''

						if (gSettings.livePing) {
							liveMessage = liveMessage + '@here, '
						}
						liveMessage = liveMessage + name + ' is now live on Mixer!'

						var channel = this.channels.get(channelID);
						if (channel !== null) {
							channel.sendEmbed(liveEmbed, liveMessage) // send the live message to servers
						}
					}
				}
			}
		}
	}
}

console.log('Configuring Klasa.')
configureKlasa();
console.log('Klasa configured.')

console.log('Logging in.')
client.login(client.config.token)
console.log('Logged in.')

console.log('Configuring client.')
configureClient();
console.log('Client configured.')

console.log('Loading streamers into txt from JSON.')
// Load streamers
loadStreamers();
console.log('Streamers loaded into txt files.')

console.log('Loading Mixer streamers into memory.')
// Load Mixer streamers.
var streamersMixer = fs.readFileSync(streamerFolder + '/mixerStreamers.txt', 'utf-8').split(', ')
streamersMixer.pop()
var mixerStreamerCount = streamersMixer.length
console.log('Loaded Mixer streamers into memory.')

console.log('Loading Twitch streamers into memory.')
var streamersTwitch = fs.readFileSync(streamerFolder + '/twitchStreamers.txt', 'utf-8').split(', ')
streamersTwitch.pop()
var streamerCountTwitch = streamersTwitch.length
console.log(chalk.magenta(`Now stalking ${streamerCountTwitch} streamers on Twitch!`))
console.log('Loaded Twitch streamers into memory.')

console.log('Connecting to Mixer Constellation and other stuffs.')

const ws = new WebSocket('wss://constellation.mixer.com', {
	headers: {
		"x-is-bot": "true"
	}
});

function configureConstellation() {
	ws.on('message', function incoming(data) {
		var messageData = JSON.parse(data);

		if (messageData !== null) {
			if (messageData.event === 'live') {
				if (messageData.data !== null) {
					if (messageData.data.payload.updatedAt !== null) {
						if (messageData.data.payload.online) {
							var channelString = messageData.data.channel.split(':');
							var channelId = channelString[1];
							var url = `https://mixer.com/api/v1/channels/${channelId}`;

							fetch(url)
								.then(checkStatus)
								.then(res => res.json())
								.then(mixerInfo => {
									if (mixerInfo == null) {
										console.log(`Null response from: ${url}`);
										console.log(``);

										return;
									}

									var game = "";

									if (mixerInfo.type == null) {
										game = "A game";
									}
									else {
										game = mixerInfo.type.name;
									}

									var liveTime = (new Date()).getTime() // time the bot sees they went live
									var mixerD = new MixerJSON(channelId)
									var lastLiveTime = mixerD.streamerData.liveTime
									var timeDiff = liveTime - lastLiveTime // gets the diff of current and last live times

									if (timeDiff >= halfHour) { // if its been 30min or more
										var args = [mixerInfo.token, game, mixerInfo.name, mixerInfo.user.avatarUrl, mixerInfo.numFollowers, mixerInfo.viewersTotal, mixerInfo.user.level, mixerInfo.id]
										var v = JSON.stringify(args)
										client.shard.broadcastEval(`(${liveMixer}).apply(this, ${JSON.stringify(args)})`)

										if (mixerInfo.token === mixerD.streamerData.name) {
											mixerD.streamerData.liveTime = liveTime
											fs.writeFileSync(streamerFolderMixer + '/' + channelId + '.json', JSON.stringify(mixerD.streamerData))
										} else {
											mixerD.streamerData.name = mixerInfo.token
											mixerD.streamerData.liveTime = liveTime
											fs.writeFileSync(streamerFolderMixer + '/' + channelId + '.json', JSON.stringify(mixerD.streamerData))
										}
									}
								})

						}
					}
				}
			}
		}
	});
}


class MixerJSON {
	constructor(id) {
		var rawdata = fs.readFileSync(streamerFolderMixer + '/' + id + '.json')
		this.streamerData = JSON.parse(rawdata)
	}
}

console.log('Connected to Mixer Constellation and did other stuffs.')

function pingMixer() {
	var ping = {
		"id": 1,
		"type": "method",
		"method": "ping",
		"params": null
	}

	ws.send(JSON.stringify(ping));
}

if (client.shard.id === 0) { // only the main/first shard
	configureConstellation();

	setInterval(pingMixer, 10000);

	delay(30000).then(() => {
		mixerCheck()
	})

	// console.log('Waiting 60 seconds, then doing our initial Twitch check.')
	delay(60000).then(() => {
		twitchCheck()

		setInterval(twitchCheck, 120000) // run the check every 2min
	})
}