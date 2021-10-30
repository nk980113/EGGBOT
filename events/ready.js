const logger = require('../logger');
module.exports = {
    name: 'ready',
    once: true,
    do: [c => {
        logger.info(`ready:以${c.user.tag}身分登入`);
    }]
};