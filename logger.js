const { pino } = require('pino');
const transport = pino.transport({
    target: 'pino/file',
    options: { destination: './log.json' },
});
const logger = pino(transport);
module.exports = logger;