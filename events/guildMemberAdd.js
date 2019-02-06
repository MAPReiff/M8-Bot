const {
	Event
} = require('klasa');

module.exports = class extends Event {

	run(member) {
		const settings = member.guild.settings

		if (settings.defaultRole != null) {
			// console.log(member)
			member.roles.add(settings.defaultRole);
			return
		}
	}

};