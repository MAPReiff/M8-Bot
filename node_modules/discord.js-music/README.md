# Discord.js Music Plugin

This version is not yet stable, although has been mildly tested, it has not been that extensive. It's an update of the original by [ruiqimao](https://github.com/ruiqimao/discord.js-music) for [Discord.js](https://discord.js.org/)'s version v11.x, and adds a few extra sprinkles. It still requires tweaks and testing but yeah it's something.

It adds:
* volume control (1 - 200)
* a music manager by Discord role (multi-server compatible, customizable)
* (optionally) restricts `skip` to the person who added the request, and music managers
* restricts `resume`, `pause`, and `volume` to music managers

Things to do:
* ~~Turn `musicManager` into an object to contain and support multiple guilds.~~
* Make sure it really really works
* Get search working again

Things left to test:
* Sharing queue across multiple servers 

Installation:  
1. Download and extract anywhere  
2. Edit examples/musicBot to match your needed config  
3. In the root folder, run:
```bash
npm install
```


This is a music plugin for Discord.js. Using it is as easy as:
```javascript
const Client = require('discord.js').Client;
const music = require('./path/to/this/project');

const client = new Client();
music(client);

client.login('< bot token here >');
```

The module consists of a single function, which takes two arguments:
```javascript
/*
 * Initialize the music plugin.
 *
 * @param client The Discord.js client.
 * @param options (Optional) A set of options to use:
 *                prefix: The prefix to use for the command (default '!').
 *                global: Whether to use the same queue for all servers
 *                        instead of server-specific queues (default false).
 *                maxQueueSize: The maximum queue size (default 20).
 				  volume: The volume to start playback at (default 50 [0.5]).
 				  		  anyoneCanSkip: Allow anyone to skip a track (if disabled, only the music managers + the person who added can skip). (default false).
 				  musicManager: The name of the Discord role approved to manage the bot. (default empty object)
 				  clearInvoker: Have the bot remove messages which invoke, these are the one that start with the 		 prefix provided. (default false)

 */
music(client, options);
```

How to add "Music Managers"
```javascript
musicManager: {
		'<server id>': '<role name>'
	},
```

**How to get server id?**  
1. Goto server settings  
2. Select 'Widget'  
3. Copy the number in `SERVER ID`

**What permissions do the roles need?**
- Nothing, this uses only the _name_ of the role rather than permissions.

The commands available are:
* `play <url>`: Play a video/music. It can take a URL from various services (YouTube, Vimeo, YouKu, etc). Search has been removed temporally until a workaround can be found.
* `skip [number]`: Skip some number of songs. Will skip 1 song if a number is not specified.
* `queue`: Display the current queue.
* `pause`: Pause music playback. (requires music manager)
* `resume`: Resume music playback. (requires music manager)
* `volume`: Adjust the playback volume between 1 and 200 (requires music manager)
