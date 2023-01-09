const logger = require('../logger');
const handleError = require('../error');
module.exports = {
    name: 'ready',
    once: true,
    do: [c => {
        logger.info(`ready:Logged in as ${c.user.tag} after about ${Date.now() - process.env.timestamp}ms`, true);
        c.user.setPresence({ activities: [{ type: 'COMPETING', name: '斜線指令：/commands | 訊息指令：未開發' }], status: 'dnd' });
        process
            .on('uncaughtException', handleError.bind(this, c))
            .on('unhandledRejection', handleError.bind(this, c));
    }],
};
