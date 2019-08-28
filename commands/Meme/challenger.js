const {
    Command
} = require('klasa');

module.exports = class extends Command {
	constructor (...args) {
		super(...args, {
			name: 'challenger',
			enabled: true,
			runIn: ['text', 'dm'],
			cooldown: 0,
			deletable: false,
			bucket: 1,
			aliases: [],
			guarded: false,
			nsfw: false,
			permissionLevel: 0,
			requiredPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			requiredSettings: [],
			subcommands: false,
			description: 'Get a challenger image.',
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

		let msg = await message.channel.send(`<a:loading:417323455147540490> here comes a new challenger...`)

		await message.channel.send(new MessageAttachment(
			await this.client.idiotAPI.challenger(target.displayAvatarURL({
				format: 'png',
				size: 128
			})),
			'challenger.png'))

		await msg.delete()
	}

	async init () {
		/*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
	}
}
