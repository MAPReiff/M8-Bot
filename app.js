const {
    token
} = require('./config.json');

const {
    KlasaClient,
    Schema
} = require('klasa');

const client = new KlasaClient({
    prefix: '-',
    providers: {
        default: 'rethinkdb'
    },
        ownerID: '145367010489008128',
        fetchAllMembers: false,
        prefix: '-',
        commandEditing: true,
        typing: true,
        readyMessage: (client) => `Successfully initialized. Ready to serve ${client.guilds.size} guilds.`
});



//Default Server Config
KlasaClient.defaultGuildSchema.add('mixerLiveChannel', 'TextChannel');
KlasaClient.defaultGuildSchema.add('twitchLiveChannel', 'TextChannel');
KlasaClient.defaultGuildSchema.add('modLog', 'TextChannel');
KlasaClient.defaultGuildSchema.add('welcomeChannel', 'TextChannel');

KlasaClient.defaultGuildSchema.add('livePing', 'Boolean', {
    default: false
})
KlasaClient.defaultGuildSchema.add('defaultRole', 'role');

//Default User Config
KlasaClient.defaultClientSchema.add('points', 'float', {
    default: 10
});


client.login(token);