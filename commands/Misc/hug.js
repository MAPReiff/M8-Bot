const {
    Command,
    RichDisplay
} = require('klasa');

module.exports = class extends Command {
	constructor (...args) {
		super(...args, {
			name: 'hug',
			enabled: true,
			runIn: ['text'],
			cooldown: 0,
			deletable: false,
			bucket: 1,
			aliases: ['hugs'],
			guarded: false,
			nsfw: false,
			permissionLevel: 0,
			requiredPermissions: [],
			requiredSettings: [],
			subcommands: false,
			description: '',
			quotedStringSupport: false,
			usage: '',
			usageDelim: undefined,
			extendedHelp: 'No extended help available.'
		})
	}

	async run (message, [...params]) {
		const settings = message.guild.settings

		var who = ''
		if (message.content.startsWith(settings.prefix + 'hugs ')) {
			who = message.content.replace(settings.prefix + 'hugs ', '')
		}
		if (message.content.startsWith(settings.prefix + 'hug ')) {
			who = message.content.replace(settings.prefix + 'hug ', '')
		}
		if (who === undefined) {
			return message.reply('who you wanna hug?')
		} else {
			message.channel.send(message.author.username + ' gave ' + who + ' a nice, big, hug!')
		}
	}

	async init () {
		/*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
	}
}
