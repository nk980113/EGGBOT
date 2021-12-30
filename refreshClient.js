const { readdirSync } = require('fs');
const { join } = require('path');
const logger = require('./logger');

const refreshClient = client => {
    client.removeAllListeners();
    const events = readdirSync('./events');
    for (const file of events) {
        if (!file.endsWith('.js')) continue;
        delete require.cache[join(__dirname, 'events', file)];
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

    require('./refresh')();
};

module.exports = refreshClient;