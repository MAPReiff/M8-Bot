const NAME = new Discord.RichEmbed()
  .setTitle(beam + "\'s Stream")
  .setAuthor(beam)
  .setColor(0x00AE86)
  .setDescription("Hey guys, " + beam + " is live right now! Click here to watch!", "http://beam.pro" + beam)
  .setFooter("Sent via Com Bot", "https://github.com/MAPReiff/Discord-Bot")
  .setThumbnail(beamInfo.avatarUrl)
  .setTimestamp()
  .setURL("http://beam.pro/" + beam)
  .addField("Streaming", beamInfo.type.name, true)
  .addField("Followers", beamInfo.numFollowers, true)

  msg.channel.sendEmbed(
    NAME,
    "this is some content but nobody cares",
    { disableEveryone: true }
  );



  new Discord.RichEmbed()
    .setTitle("Very Nice Title")
    .setAuthor("Author Name", "https://goo.gl/rHndF5")
    .setColor(0x00AE86)
    .setDescription("The text of the body, essentially")
    .setFooter("Nice text at the bottom", "https://goo.gl/hkFYh0")
    .setImage("https://goo.gl/D3uKk2")
    .setThumbnail("https://goo.gl/lhc6ke")
    .setTimestamp()
    .setURL("https://discord.js.org/#/docs/main/indev/class/RichEmbed")
    .addField("Field Title", "Field Value")
    .addField("Inline Field", "Hmm 🤔", true)
    .addField("\u200b", "\u200b", true)
    .addField("Second (3rd place) Inline Field", "I\'m in the ZOONE", true);
