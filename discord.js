require('./refresh')();

const { Client, Intents } = require('discord.js');
const fs = require('fs');
const { token } = require('./token.json');
const logger = require('./logger');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

logger.info('----------------------------------------------------------');
const events = fs.readdirSync('./events');
for (const file of events) {
    if (!file.endsWith('.js')) continue;
    const event = require(`./events/${file}`);
    if (event.once) {
        event.do.forEach(f => {
            client.once(event.name, (...args) => f(...args));
        });
        logger.info(`main:added once listener to event "${event.name}"`);
    } else {
        event.do.forEach(f => {
            client.on(event.name, (...args) => f(...args));
        });
        logger.info(`main:added listener to event "${event.name}"`);
    }
}
client.login(token);