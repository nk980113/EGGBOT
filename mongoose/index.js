const { soup } = require('./connections');
module.exports = Promise.all([soup.asPromise()]);
