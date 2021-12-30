const client = new (require('discord.js').Client)({ intents: 1 });

require('./logger').info('----------------------------------------------------------');
require('./refreshClient')(client);
client.login(require('./token.json').token);

process.on('beforeExit', () => {
    client.destroy();
});