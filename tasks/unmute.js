// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { Task } from 'klasa'

/*

	This is to be used with the mute command located in
	/commands/Moderation/mute.js

*/

export default class extends Task {
	async run ({ guild, user }) {
		const _guild = this.client.guilds.get(guild)
		if (!_guild) return
		const member = await _guild.members.fetch(user).catch(() => null)
		if (!member) return
		await member.roles.remove(_guild.settings.muted)
	}
}
