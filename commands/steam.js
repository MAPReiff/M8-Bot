const Discord = require('discord.js');
const settings = require('../settings.json');
var request = require("request");

exports.run = (client, message) => {
  message.delete();
  var search = message.content.replace(settings.prefix + "steam ", "")
  //search link = http://store.steampowered.com/api/storesearch/?term={TERM HERE}&l=english&cc=US
  request("http://store.steampowered.com/api/storesearch/?term={" + search + "}&l=english&cc=US", function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var results = JSON.parse(body)
      if (results.total != 0) {
        var steamID = results.items[0].id
        //app link = http://store.steampowered.com/api/appdetails?appids=steamID
        request("http://store.steampowered.com/api/appdetails?appids=" + steamID, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            var rawData = JSON.parse(body)
            var appData = rawData[steamID]
            //console.log(appData.data.name)
            var name = appData.data.name
            var image = appData.data.header_image
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

            const steamEmbed = new Discord.RichEmbed()
              .setTitle(name)
              .setColor(0x9900FF)
              .setFooter("Sent via M8 Bot", "http://i.imgur.com/nXvRJXM.png")
              .setURL("http://store.steampowered.com/app/" + steamID)
              .setImage(image)
              .setThumbnail(image)
              .setTimestamp()
              .addField("Price", price, true)
              .addField("Publisher", publisher, true)
              .addField("Release Date", date, true)
              .addField("Windows", windows, true)
              .addField("Mac", mac, true)
              .addField("Linux", linux, true)
            message.channel.send({
              embed: steamEmbed
            });
          }
        });
      } else {
        message.channel.send("Could not find info for " + search + ". Please try again.")
      }
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'steam',
  description: 'Used to get info about a steam game.',
  usage: '!steam ___'
};
