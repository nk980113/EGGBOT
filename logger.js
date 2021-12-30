const { pino, transport } = require('pino');
const logger = pino(transport({
    target: 'pino/file',
    options: { destination: './log.txt' },
}));

module.exports = logger;