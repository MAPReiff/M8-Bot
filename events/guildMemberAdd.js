import { Event } from 'klasa'

export default class extends Event {
	run (member) {
		const settings = member.guild.settings

		if (settings.defaultRole != null) {
			member.roles.add(settings.defaultRole)
		}
	}
}
