const {
    Command
} = require('klasa');

module.exports = class extends Command {
	constructor (...args) {
		super(...args, {
			name: 'steamcard',
			enabled: true,
			runIn: ['text', 'dm'],
			cooldown: 0,
			deletable: false,
			bucket: 1,
			aliases: ['card'],
			guarded: false,
			nsfw: false,
			permissionLevel: 0,
			requiredPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			requiredSettings: [],
			subcommands: false,
			description: 'Get a steam card image.',
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

		let msg = await message.channel.send(`<a:loading:417323455147540490> It's ${target.username}, but in card form...`)

		await message.channel.send(new MessageAttachment(
			await this.client.idiotAPI.steam(target.displayAvatarURL({
				format: 'png',
				size: 128
			}), target.tag), 'card.png'))

		await msg.delete()
	}

	async init () {
		/*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
	}
}
