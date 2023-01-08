const mongoose = require('mongoose');

const soup = mongoose.createConnection(require('../setup/token.json').mongourl.turtleSoup);

module.exports = {
    soup,
};