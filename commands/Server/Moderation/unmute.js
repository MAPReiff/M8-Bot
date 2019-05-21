// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { Command } from 'klasa'

export default class extends Command {
	constructor (...args) {
		super(...args, {
			permissionLevel: 5,
			requiredPermissions: ['MANAGE_ROLES'],
			runIn: ['text'],
			description: 'Unmutes a mentioned user.',
			usage: '<member:member> [reason:...string]',
			usageDelim: ' ',
			requiredSettings: ['muted']
		})
	}

	async run (msg, [member, reason]) {
		const Discord = require('discord.js')
		const {
			MessageEmbed
		} = require('discord.js')
		require('discord.js-aliases')

		const settings = msg.guild.settings

		if (member.roles.highest.position >= msg.member.roles.highest.position) throw 'You cannot unmute this user.'
		if (!member.roles.has(msg.guild.settings.muted)) throw 'This user is not muted.'

		await member.roles.remove(msg.guild.settings.muted)

		const unMuteEmbed = new Discord.MessageEmbed()
			.setAuthor('M8 Bot Moderation')
			.addField('Unmuted User', `${member} (${member.user.tag})`)
			.addField('Moderator', `${msg.author} (${msg.author.tag})`)
			.addField('Reason', reason)
			.setFooter('Sent via M8 Bot', 'http://m8bot.js.org/img/profile.png')
			.setThumbnail(member.user.displayAvatarURL())
			.setColor(0x9900FF)

		if (settings.modLog != null) {
			msg.guild.channels.get(settings.modLog).send({
				embed: unMuteEmbed
			}).catch(err => console.log(err))
		}

		return msg.channel.send({
			embed: unMuteEmbed
		})

		// return msg.sendMessage(`${member.user.tag} was unmuted.${reason ? ` With reason of: ${reason}` : ''}`);
	}
}
