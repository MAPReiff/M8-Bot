const {
    Command,
    RichDisplay
} = require('klasa');
const {
    MessageEmbed
} = require('discord.js');

module.exports = class extends Command {
	constructor (...args) {
		super(...args, {
			name: 'user',
			enabled: true,
			runIn: ['text', 'dm'],
			cooldown: 0,
			deletable: false,
			bucket: 1,
			aliases: ['me', 'userinfo'],
			guarded: false,
			nsfw: false,
			permissionLevel: 0,
			requiredPermissions: [],
			requiredSettings: [],
			subcommands: false,
			description: 'Get information on a user.',
			quotedStringSupport: false,
			usage: '[Member:member]',
			usageDelim: undefined,
			extendedHelp: 'No extended help available.'
		})
	}

	async run (message, [member = message.member]) {
		var statuses = {
			online: '💚 Online',
			idle: '💛 Idle',
			dnd: '❤ Do Not Disturb',
			offline: '💔 Offline'
		}

		const meEmbed = new MessageEmbed()
			.setTitle(member.user.username)
			.setColor(0x9900FF)
			.setFooter('Sent via M8 Bot', 'http://m8bot.js.org/img/profile.png')
			.setThumbnail(member.user.displayAvatarURL())
			.setTimestamp()
			.addField('ID', member.user.id, true)
			.addField('Status', statuses[member.presence.status], true)
			.addField('Playing', member.presence.activity ? member.presence.activity.name : 'N/A', true)
			.addField('Bot', member.user.bot, true)
			.addField('Registered', member.user.createdAt)
		message.channel.send({
			embed: meEmbed
		})
	};

	async init () {
		/*
     * You can optionally define this method which will be run when the bot starts
     * (after login, so discord data is available via this.client)
     */
	}
}
