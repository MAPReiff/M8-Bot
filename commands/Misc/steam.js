const {
    Command,
    RichDisplay
} = require('klasa');
const {
    MessageEmbed
} = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
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
        });
    }

    async run(message, [game]) {

        const fetch = require('node-fetch')

        function checkStatus(res) {
            if (res.ok) { // res.status >= 200 && res.status < 300
                return res;
            } else {
                return message.reply(`I could not find ${game} in Steam's database!`)
            }
        }

        fetch(`http://store.steampowered.com/api/storesearch/?term={${game}}&l=english&cc=US`)
            .then(checkStatus)
            .then(res => res.json())
            .then(async results => {

                if (results.total != 0) {

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
                                var screens = 3
                                var images = [
                                    screen1,
                                    screen2,
                                    screen3
                                ];
                            }
                            if (appData.data.screenshots.length == 2) {
                                var screen1 = appData.data.screenshots[0].path_full
                                var screen2 = appData.data.screenshots[1].path_full
                                var screens = 2
                                var images = [
                                    screen1,
                                    screen2
                                ];
                            }
                            if (appData.data.screenshots.length == 1) {
                                var screen1 = appData.data.screenshots[0].path_full
                                var screens = 1
                                var images = [
                                    screen1
                                ];
                            }


                            if (appData.data.is_free == true) {
                                var price = "Free"
                            } else {
                                if (appData.data.price_overview == undefined) {
                                    var price = "N/A"
                                } else {
                                    var price = (appData.data.price_overview.final / 100)
                                }
                            }

                            var publisher = appData.data.publishers

                            if (publisher == "") {
                                var publisher = "N/A"

                            }


                            if (appData.data.platforms.windows = "true") {
                                var windows = "Yes"
                            } else {
                                var windows = "No"
                            }
                            if (appData.data.platforms.mac = "true") {
                                var mac = "Yes"
                            } else {
                                var mac = "No"
                            }
                            if (appData.data.platforms.linux = "true") {
                                var linux = "Yes"
                            } else {
                                var linux = "No"
                            }
                            var date = appData.data.release_date.date
                            var description = appData.data.short_description
                            if (description.length >= 160) {
                                var description = description.substring(0, 160) + '...'
                            }


                            const display = new RichDisplay(new MessageEmbed()
                                .setColor(0x9900FF)
                                .setTitle(name)
                                .setURL("http://store.steampowered.com/app/" + steamID)
                                .setThumbnail(image)
                                .setFooter("Sent via M8 Bot", "http://m8bot.js.org/img/profile.png")
                                .setTimestamp()
                                // .setDescription('Scroll between the pages using the provided reaction emotes.')

                            );

                            // display.addPage(template => {
                            //     template
                            //         .setImage(image)
                            //         .addField("Price", price, true)
                            //         .addField("Publisher", publisher, true)
                            //         .addField("Release Date", date, true)
                            //         .addField("Windows", windows, true)
                            //         .addField("Mac", mac, true)
                            //         .addField("Linux", linux, true)
                            // });

                            display.addPage(template =>
                                template
                                .setImage(image)
                                .addField("Price", price, true)
                                .addField("Publisher", publisher, true)
                                .addField("Release Date", date, true)
                                .addField("Windows", windows, true)
                                .addField("Mac", mac, true)
                                .addField("Linux", linux, true)
                                .setDescription(description)
                                // You can change everything of the template
                            );

                            for (let i = 0; i < images.length; i++) {
                                display.addPage(template => template.setImage(images[i]));
                            }

                            return display.run(await message.send('Loading...'));


                        })


                } else {
                    return message.reply(`I could not find ${game} in Steam's database!`)

                }



            })

    }

    async init() {
        /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
    }

};