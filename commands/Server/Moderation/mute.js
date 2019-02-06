// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
const {
	Command,
	Duration
} = require('klasa');

/*

	To use this correctly, you will also need the unmute task located in
	/tasks/unmute.js

*/

// Add to your schema definition:
// KlasaClient.defaultGuildSchema.add('roles', schema => schema
//   .add('muted', 'role'));

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 5,
			requiredPermissions: ['MANAGE_ROLES'],
			runIn: ['text'],
			description: 'Mutes a mentioned member.',
			usage: '[when:time] <member:member> [reason:...string]',
			extendedHelp: 'Time is how long (such as 2m for 2 min, or 1h for 1 hour). Name is the name of the user. Reason is the reason for their mute.\nTime and reason are both optional.\nIf time is provided, they will be automatically unmuted when the time is up.\nThe muted role must be set in the server config to use the command.',
			usageDelim: ' ',
			requiredSettings: ['muted']
		});
	}

	async run(msg, [when, member, reason]) {

		const Discord = require("discord.js");
		const {
			MessageEmbed
		} = require('discord.js');
		require('discord.js-aliases');

		const settings = msg.guild.settings

		if (member.id === msg.author.id) throw 'Why would you mute yourself?';
		if (member.id === this.client.user.id) throw 'Have I done something wrong?';

		if (member.roles.highest.position >= msg.member.roles.highest.position) throw 'You cannot mute this user.';

		if (member.roles.has(msg.guild.settings.muted)) throw 'The member is already muted.';

		if (Duration.toNow(when) == "seconds") throw 'The minimum mute time is 1 minute.'


		await member.roles.add(msg.guild.settings.muted);

		if (when) {
			await this.client.schedule.create('unmute', when, {
				data: {
					guild: msg.guild.id,
					user: member.id
				}
			});

			const muteEmbed = new Discord.MessageEmbed()
				.setAuthor("M8 Bot Moderation")
				.addField("Muted User", `${member} (${member.user.tag})`)
				.addField("Moderator", `${msg.author} (${msg.author.tag})`)
				.addField("Time", Duration.toNow(when))
				.addField("Reason", reason)
				.setFooter("Sent via M8 Bot", "http://m8bot.js.org/img/profile.png")
				.setThumbnail(member.user.displayAvatarURL())
				.setColor(0x9900FF);

			if (settings.modLog != null) {
				msg.guild.channels.get(settings.modLog).send({
					embed: muteEmbed
				}).catch(err => console.log(err));
			}

			return msg.channel.send({
				embed: muteEmbed
			});

			// return msg.sendMessage(`${member.user.tag} got temporarily muted for ${Duration.toNow(when)}.${reason ? ` With reason of: ${reason}` : ''}`);
		}

		const muteEmbed = new Discord.MessageEmbed()
			.setAuthor("M8 Bot Moderation")
			.addField("Muted User", `${member} (${member.user.tag})`)
			.addField("Moderator", `${msg.author} (${msg.author.tag})`)
			.addField("Reason", reason)
			.setFooter("Sent via M8 Bot", "http://m8bot.js.org/img/profile.png")
			.setThumbnail(member.user.displayAvatarURL())
			.setColor(0x9900FF);

		if (settings.modLog != null) {
			msg.guild.channels.get(settings.modLog).send({
				embed: muteEmbed
			}).catch(err => console.log(err));
		}

		return msg.channel.send({
			embed: muteEmbed
		});

		// return msg.sendMessage(`${member.user.tag} got muted.${reason ? ` With reason of: ${reason}` : ''}`);
	}

};