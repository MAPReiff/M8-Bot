import { Command, RichDisplay } from 'klasa'
import { MessageEmbed } from 'discord.js'

export default class extends Command {
	constructor (...args) {
		super(...args, {
			name: 'steam',
			enabled: true,
			runIn: ['text', 'dm'],
			cooldown: 0,
			deletable: false,
			bucket: 1,
			aliases: [],
			guarded: false,
			nsfw: false,
			permissionLevel: 0,
			requiredPermissions: ['SEND_MESSAGES'],
			requiredSettings: [],
			subcommands: false,
			description: 'Gets info on a steam game.',
			quotedStringSupport: false,
			usage: '[game:...string]',
			usageDelim: undefined,
			extendedHelp: 'No extended help available.'
		})
	}

	async run (message, [game]) {
		const fetch = require('node-fetch')

		function checkStatus (res) {
			if (res.ok) {
				return res
			} else {
				return message.reply(`I could not find ${game} in Steam's database!`)
			}
		}

		fetch(`http://store.steampowered.com/api/storesearch/?term={${game}}&l=english&cc=US`)
			.then(checkStatus)
			.then(res => res.json())
			.then(async results => {
				if (results.total !== 0) {
					var steamID = results.items[0].id

					fetch(`http://store.steampowered.com/api/appdetails?appids=${steamID}`)
						.then(checkStatus)
						.then(res => res.json())
						.then(async gameInfo => {
							var appData = gameInfo[steamID]

							var name = appData.data.name
							var image = appData.data.header_image

							if (appData.data.screenshots.length >= 3) {
								var screen1 = appData.data.screenshots[0].path_full
								var screen2 = appData.data.screenshots[1].path_full
								var screen3 = appData.data.screenshots[2].path_full
								var images = [
									screen1,
									screen2,
									screen3
								]
							}
							if (appData.data.screenshots.length === 2) {
								screen1 = appData.data.screenshots[0].path_full
								screen2 = appData.data.screenshots[1].path_full
								images = [
									screen1,
									screen2
								]
							}
							if (appData.data.screenshots.length === 1) {
								screen1 = appData.data.screenshots[0].path_full
								images = [
									screen1
								]
							}

							if (appData.data.is_free) {
								var price = 'Free'
							} else {
								if (appData.data.price_overview === undefined) {
									price = 'N/A'
								} else {
									price = (appData.data.price_overview.final / 100)
								}
							}

							var publisher = appData.data.publishers

							if (publisher === '') {
								publisher = 'N/A'
							}

							var windows = 'No'
							var mac = 'No'
							var linux = 'No'

							if (appData.data.platforms.windows === 'true') {
								windows = 'Yes'
							}

							if (appData.data.platforms.mac === 'true') {
								mac = 'Yes'
							}

							if (appData.data.platforms.linux === 'true') {
								linux = 'Yes'
							}

							var date = appData.data.release_date.date
							var description = appData.data.short_description

							if (description.length >= 160) {
								description = description.substring(0, 160) + '...'
							}

							const display = new RichDisplay(new MessageEmbed()
								.setColor(0x9900FF)
								.setTitle(name)
								.setURL('http://store.steampowered.com/app/' + steamID)
								.setThumbnail(image)
								.setFooter('Sent via M8 Bot', 'http://m8bot.js.org/img/profile.png')
								.setTimestamp()
							)

							display.addPage(template =>
								template
									.setImage(image)
									.addField('Price', price, true)
									.addField('Publisher', publisher, true)
									.addField('Release Date', date, true)
									.addField('Windows', windows, true)
									.addField('Mac', mac, true)
									.addField('Linux', linux, true)
									.setDescription(description)
							)

							for (let i = 0; i < images.length; i++) {
								display.addPage(template => template.setImage(images[i]))
							}

							return display.run(await message.send('Loading...'))
						})
				} else {
					return message.reply(`I could not find ${game} in Steam's database!`)
				}
			})
	}

	async init () {
		/*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
	}
}
