import { Command } from 'klasa'

export default class extends Command {
	constructor (...args) {
		super(...args, {
			name: 'serverInfo',
			enabled: true,
			runIn: ['text'],
			cooldown: 0,
			deletable: false,
			bucket: 1,
			aliases: ['server', 'guild'],
			guarded: false,
			nsfw: false,
			permissionLevel: 0,
			requiredPermissions: [],
			requiredSettings: [],
			subcommands: false,
			description: 'Shows information about the server you are in.',
			quotedStringSupport: false,
			usageDelim: undefined,
			extendedHelp: 'No extended help available.'
		})
		this.verificationLevels = [
			'None',
			'Low',
			'Medium',
			'(╯°□°）╯︵ ┻━┻',
			'┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
		]
		this.filterLevels = [
			'Off',
			'No Role',
			'Everyone'
		]
	}

	async run (message, [...params]) {
		const {
			MessageEmbed
		} = require('discord.js')

		var iconURL = ''
		if (message.guild.iconURL === null) {
			iconURL = 'https://newagesoldier.com/wp-content/uploads/2016/12/masbot.png'
		} else {
			iconURL = message.guild.iconURL
		}

		const serverEmbed = new MessageEmbed()
			.setTitle(message.guild.name)
			.setColor(0x9900FF)
			.setFooter('Sent via M8 Bot', 'http://m8bot.js.org/img/profile.png')
			.setThumbnail(iconURL)
			.setTimestamp()
			.addField('Server ID', message.guild.id)
			.addField('Region', message.guild.region, true)
			.addField('Owner', message.guild.owner, true)
			.addField('Member Count', `${message.guild.memberCount - message.guild.members.filter(m=>m.user.bot).size} (${message.guild.members.filter(m=>m.user.bot).size} bots)`, true)
			.addField('Roles', message.guild.roles.size, true)
			.addField('Channels', message.guild.channels.size, true)
			.addField('Explicit Filter', this.filterLevels[message.guild.explicitContentFilter], true)
			.addField('Verification Level', this.verificationLevels[message.guild.verificationLevel], true)
			.addField('Created At', message.guild.createdAt)
			.addField('Joined Server At', message.guild.joinedAt)

		message.channel.send({
			embed: serverEmbed
		})
	}

	async init () {
		/*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
	}
}
