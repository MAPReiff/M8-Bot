import { Command } from 'klasa'
import { MessageEmbed } from 'discord.js'

export default class extends Command {
	constructor (...args) {
		super(...args, {
			name: 'mixer',
			enabled: true,
			runIn: ['text', 'dm'],
			cooldown: 0,
			deletable: false,
			bucket: 1,
			aliases: [],
			guarded: false,
			nsfw: false,
			permissionLevel: 0,
			requiredPermissions: ['SEND_MESSAGES'],
			requiredSettings: [],
			subcommands: false,
			description: 'Gets information about a Mixer Streamer',
			quotedStringSupport: false,
			usage: '[streamer:...string]',
			usageDelim: undefined,
			extendedHelp: 'No extended help available.'
		})
	}

	async run (message, [streamer]) {
		const fetch = require('node-fetch')

		function checkStatus (res) {
			if (res.ok) {
				return res
			} else {
				return message.reply(`I could not find ${streamer} on Mixer!`)
			}
		}

		fetch(`https://mixer.com/api/v1/channels/${streamer}`)
			.then(checkStatus)
			.then(res => res.json())
			.then(mixerInfo => {
				const mixerStuff = new MessageEmbed()
					.setColor(0x9900FF)
					.setTitle(mixerInfo.token)
					.setFooter('Sent via M8 Bot', 'http://m8bot.js.org/img/profile.png')
					.setTimestamp()
					.setThumbnail(mixerInfo.user.avatarUrl)
					.setURL('http://mixer.com/' + mixerInfo.token)
					.addField('Online', mixerInfo.online, true)
					.addField('Followers', mixerInfo.numFollowers, true)
					.addField('Mixer Level', mixerInfo.user.level, true)
					.addField('Total Views', mixerInfo.viewersTotal, true)
					.addField('Joined Mixer', mixerInfo.createdAt, true)
					.addField('Audience', mixerInfo.audience, true)
					.addField('Partnered', mixerInfo.partnered, true)
				message.channel.send({
					embed: mixerStuff
				})
			})
	}

	async init () {
		/*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
	}
}
