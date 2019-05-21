import { Command } from 'klasa'
import { MessageEmbed } from 'discord.js'

export default class extends Command {
	constructor (...args) {
		super(...args, {
			name: 'anime',
			enabled: true,
			runIn: ['text', 'dm'],
			cooldown: 0,
			deletable: false,
			bucket: 1,
			aliases: ['weebshow'],
			guarded: false,
			nsfw: false,
			permissionLevel: 0,
			requiredPermissions: ['SEND_MESSAGES'],
			requiredSettings: [],
			subcommands: false,
			description: '',
			quotedStringSupport: false,
			usage: '[show:...string]',
			usageDelim: undefined,
			extendedHelp: 'No extended help available.'
		})
	}

	async run (message, [show]) {
		const malScraper = require('mal-scraper')
		malScraper.getInfoFromName(show)
			.then((data) => {
				var title = data.title
				var description = data.synopsis
				if (description.length >= 160) {
					description = description.substring(0, 160) + '...'
				}
				var image = data.picture
				var engName = data.englishTitle
				var japName = data.japaneseTitle
				var type = data.type
				var eps = data.episodes
				var status = data.status
				var when = data.aired
				var rating = data.rating
				var score = data.score
				var url = data.url

				const animeEmbed = new MessageEmbed()
					.setTitle(title)
					.setDescription(description)
					.addField('English Name', engName, true)
					.addField('Japanese Name', japName, true)
					.addField('Type', type, true)
					.addField('Total Episodes', eps, true)
					.addField('Aired', when, true)
					.addField('Status', status, true)
					.addField('Rating', rating, true)
					.addField('Score', score, true)
					.setColor(0x9900FF)
					.setThumbnail(image)
					.setImage(image)
					.setFooter('Sent via M8 Bot', 'http://m8bot.js.org/img/profile.png')
					.setURL(url)
					.setTimestamp()

				message.channel.send({
					embed: animeEmbed
				})
			})

			.catch((err) => console.log(err))
	}

	async init () {
		/*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
	}
}
