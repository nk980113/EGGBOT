const client = new (require('discord.js').Client)({ intents: 1 + (1 << 7) });
require('./refreshClient')(client);
process.on('beforeExit', () => {
    client.destroy();
});
module.exports = client;
