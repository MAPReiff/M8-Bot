import { Command } from 'klasa'

module.exports = class extends Command {
	constructor (...args) {
		super(...args, {
			name: 'yourCommandName',
			enabled: true,
			runIn: ['text', 'dm'],
			cooldown: 0,
			deletable: false,
			bucket: 1,
			aliases: [],
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
		// This is where you place the code you want to run for your command
	}

	async init () {
		/*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
	}
}
