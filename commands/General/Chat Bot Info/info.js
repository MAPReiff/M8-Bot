const {
    Command
} = require('klasa');

module.exports = class extends Command {
	constructor (...args) {
		super(...args, {
			name: 'info',
			enabled: true,
			runIn: ['text', 'dm'],
			cooldown: 0,
			deletable: false,
			bucket: 1,
			aliases: ['stats', 'status'],
			guarded: false,
			nsfw: false,
			permissionLevel: 0,
			requiredPermissions: [],
			requiredSettings: [],
			subcommands: false,
			description: 'Gives some useful bot statistics',
			quotedStringSupport: false,
			usageDelim: undefined
		})
	}

	async run (message, [...params]) {
		const moment = require('moment')
		require('moment-duration-format')
		const {
			version
		} = require('discord.js')

		const duration = moment.duration(this.client.uptime).format(' D [days], H [hrs], m [mins], s [secs]')

		this.client.shard.broadcastEval('this.guilds.reduce((prev, guild) => prev + guild.memberCount, 0)')

		const promises = [
			this.client.shard.fetchClientValues('guilds.size'),
			this.client.shard.broadcastEval('this.guilds.reduce((prev, guild) => prev + guild.memberCount, 0)'),
			this.client.shard.fetchClientValues('channels.size')
		]

		Promise.all(promises)
			.then(results => {
				const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0)
				const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0)
				const totalChannels = results[2].reduce((prev, channelCount) => prev + channelCount, 0)

				return message.channel.send(`= STATISTICS =
                    • Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
                    • Uptime     :: ${duration}
                    • Users      :: ${totalMembers}
                    • Servers    :: ${totalGuilds}
                    • Channels   :: ${totalChannels}
                    • M8 Bot     :: v${this.client.version}
                    • Discord.js :: v${version}
                    • Node       :: ${process.version}`, {
					code: 'asciidoc'
				})
			})
			.catch(console.error)
	}

	async init () {
		/*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
	}
}
