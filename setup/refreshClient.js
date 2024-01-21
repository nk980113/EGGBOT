const logger = require('../logger');
const { fetchEvents } = require('./utils');

module.exports = function refreshClient(client) {
    client.removeAllListeners();
    for (const event of fetchEvents()) {
        if (event.once) {
            event.do.forEach(f => {
                client.once(event.name, f);
            });
            logger.info(`main:added once listener to event "${event.name}"`);
        } else {
            event.do.forEach(f => {
                client.on(event.name, f);
            });
            logger.info(`main:added listener to event "${event.name}"`);
        }
    }

    require('./refresh')();
};
