require('./logger').info('----------------------------------------------------------');
require('./setup/client').login(require('./setup/token.json').token);
// Pre-load to get google auth client
require('./DB');