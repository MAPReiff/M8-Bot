const {
    Client
} = require('klasa');

const {
    token
} = require('./config.json');



new Client({
    //    disabledCorePieces: ['providers'],
    // provider: 'rethinkdb',
    providers: {
        default: 'rethinkdb'
    },
    ownerID: '145367010489008128',
    fetchAllMembers: false,
    prefix: '-',
    commandEditing: true,
    typing: true,
    readyMessage: (client) => `Successfully initialized. Ready to serve ${client.guilds.size} guilds.`
}).login(token);

//Default Server Config
Client.defaultGuildSchema.add('mixerLiveChannel', 'TextChannel');
Client.defaultGuildSchema.add('twitchLiveChannel', 'TextChannel');
Client.defaultGuildSchema.add('modLog', 'TextChannel');
Client.defaultGuildSchema.add('welcomeChannel', 'TextChannel');

Client.defaultGuildSchema.add('livePing', 'Boolean', {
    default: false
})
Client.defaultGuildSchema.add('defaultRole', 'role');

//Default User Config
Client.defaultClientSchema.add('points', 'float', {
    default: 10
});
