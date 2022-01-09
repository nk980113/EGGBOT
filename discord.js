require('./logger').info('----------------------------------------------------------');
require('./setup/client').login(require('./setup/token.json').token);