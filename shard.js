const Discord = require('discord.js');
const Manager = new Discord.ShardingManager('./app.js');
const fetch = require('node-fetch');
const config = require("./config.js");
Manager.spawn(2); // This example will spawn 2 shards (5,000 guilds);
Manager.on('launch', shard => console.log(`Launched shard ${shard.id}`));
