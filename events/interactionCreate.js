const { ownerId } = require('../config.json');
module.exports = {
    name: 'interactionCreate',
    do(cmd) {
        if (!cmd.isCommand()) return;
        const { commandName: name } = cmd;
        const cmdClass = require('./class.json')[name];
        const cmdFile = require(`./commands/${cmdClass}/${name}`);
        if (!cmdFile.ownerOnly || cmd.user.id == ownerId) {
            cmdFile.do(cmd);
        }
    }
};