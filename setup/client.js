const client = new (require('discord.js').Client)({ intents: 1 });
require('./refreshClient')(client);
process.on('beforeExit', () => {
    client.destroy();
});
module.exports = client;
