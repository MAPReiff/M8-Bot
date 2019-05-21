import { Command } from 'klasa'
import { MessageEmbed } from 'discord.js'

export default class extends Command {
	constructor (...args) {
		super(...args, {
			name: 'purge',
			enabled: true,
			runIn: ['text'],
			cooldown: 0,
			deletable: false,
			bucket: 1,
			aliases: ['delete'],
			guarded: false,
			nsfw: false,
			permissionLevel: 5,
			requiredPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
			requiredSettings: [],
			subcommands: false,
			description: 'Deletes messages in bulk.',
			quotedStringSupport: false,
			usage: '[amount:int{1}]',
			usageDelim: undefined,
			extendedHelp: 'No extended help available.'
		})
	}

	async run (message, [amount]) {
		if (amount <= 0) {
			return message.reply('you must pick a how many messages you want purged, 1-100.')
		}

		if (amount > 100) {
			return message.reply('❌ I can only purge up to 100 messages at a time!')
		}

		if (amount >= 1 && amount <= 100) {
			message.channel.bulkDelete(amount)
			message.channel.send(`☑ Purged ${amount} message(s) from ${message.channel.name}`)
		}
	}

	async init () {
		/*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
	}
}
