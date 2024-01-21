const { readdirSync } = require('node:fs');
const { join } = require('node:path');

const eventsDir = join(__dirname, '..', 'events');
const commandsDir = join(eventsDir, 'commands');

function fetchEvents(update = true) {
    const files = readdirSync(eventsDir).filter((f) => f.endsWith('.js')).map((f) => join(eventsDir, f));
    if (update) files.forEach((f) => {
        delete require.cache[f];
    });

    return files.map(require);
}

module.exports = {
    eventsDir,
    commandsDir,
    fetchEvents,
};
