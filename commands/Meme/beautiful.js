import { Command } from 'klasa'

export default class extends Command {
	constructor (...args) {
		super(...args, {
			name: 'beautiful',
			enabled: true,
			runIn: ['text', 'dm'],
			cooldown: 0,
			deletable: false,
			bucket: 1,
			aliases: ['painting'],
			guarded: false,
			nsfw: false,
			permissionLevel: 0,
			requiredPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			requiredSettings: [],
			subcommands: false,
			description: 'Get a beautiful image.',
			quotedStringSupport: false,
			usageDelim: undefined,
			extendedHelp: 'No extended help available.'
		})
	}

	async run (message, [...params]) {
		const {
			MessageAttachment
		} = require('discord.js')

		var target = {}
		if (message.mentions.users.size >= 1) {
			target = message.mentions.users.first()
		} else {
			target = message.author
		}

		let msg
		msg = await message.channel.send(`<a:loading:417323455147540490> Wow, **${target.username}** is about to get painted...`)

		await message.channel.send(new MessageAttachment(
			await this.client.idiotAPI.beautiful(target.displayAvatarURL({
				format: 'png',
				size: 128
			})),
			'beautiful.png'))

		await msg.delete()
	}

	async init () {
		/*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
	}
}
