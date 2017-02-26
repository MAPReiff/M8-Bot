const Client = require('discord.js').Client;
const Auth = require('./auth.json');

const music = require('../');

// Create a new client.
const client = new Client();

// Apply the music plugin.
music(client, {
	prefix: '-',     // Prefix of '-'.
	global: false,   // Server-specific queues.
	maxQueueSize: 10, // Maximum queue size of 10.
	musicManager: { // List of servers and their music manager roles
		'<server id>': 'Music Manager'
	},
	clearInvoker: true // If permissions applicable, allow the bot to delete the messages that invoke it (start with prefix)
});

// Login.
client.login(Auth.token);
