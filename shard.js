const Discord = require('discord.js')
const Manager = new Discord.ShardingManager('./app.js')

Manager.spawn(2) // 2 Shards, Supports 5000 guilds.
Manager.on('launch', shard => console.log(`Launched shard ${shard.id}`))
