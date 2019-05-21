import { Command } from 'klasa'

export default class extends Command {
	constructor (...args) {
		super(...args, {
			name: 'warn',
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
			subcommands: false,
			description: 'Warns a user in the server.',
			quotedStringSupport: false,
			usageDelim: undefined,
			extendedHelp: 'No extended help available.'
		})
	}

	async run (message, [...params]) {
		const Discord = require('discord.js')
		const {
			MessageEmbed
		} = require('discord.js')
		require('discord.js-aliases')

		const settings = message.guild.settings

		const person = message.content.replace(settings.prefix, '').split(' ').slice(1)
		var reason = message.content.replace(settings.prefix, '').replace(person[0], '').replace('warn ', '')

		if (message.mentions.users.size == 0) return message.reply('you must provide a mention in order to use this command.')
		const user = message.mentions.users.first()

		if (user === message.member) return message.reply("you're a few fries short of a Happy Meal. You cant warn yourself.")
		if (user === message.guild.owner) return message.reply("you can't warn the server owner bruh...")

		if (reason === '') {
			reason = 'undefined'
		}

		const warnEmbed = new Discord.MessageEmbed()
			.setAuthor('M8 Bot Moderation')
			.addField('Warned User', `${user} (${user.tag})`)
			.addField('Moderator', `${message.author} (${message.member.user.tag})`)
			.addField('Reason', reason)
			.setFooter('Sent via M8 Bot', 'http://m8bot.js.org/img/profile.png')
			.setThumbnail(user.displayAvatarURL())
			.setColor(0x9900FF)

		message.channel.send({
			embed: warnEmbed
		})

		if (settings.modLog != null) {
			message.guild.channels.get(settings.modLog).send({
				embed: warnEmbed
			}).catch(err => console.log(err))
		}
	}

	async init () {
		/*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
	}
}
