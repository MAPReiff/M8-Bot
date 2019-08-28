const Discord = require('discord.js');
const Manager = new Discord.ShardingManager('./app.js');
const fetch = require('node-fetch');
const config = require("./config.js");

Manager.spawn(3); // This example will spawn 3 shards (7,500 guilds);
Manager.on('launch', shard => console.log(`Launched shard ${shard.id}`));