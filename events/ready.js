const logger = require('../logger');
const handleError = require('../error');
module.exports = {
    name: 'ready',
    once: true,
    do: [c => {
        logger.info(`ready:以${c.user.tag}身分登入`);
        c.user.setPresence({ activities: [{ type: 'COMPETING', name: '斜線指令：/cmds | 訊息指令：未開發' }], status: 'dnd' });
        process
            .on('uncaughtException', handleError.bind(this, c))
            .on('unhandledRejection', handleError.bind(this, c));
    }],
};