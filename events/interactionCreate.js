const { ownerId } = require('../config.json');
module.exports = {
    name: 'interactionCreate',
    do(cmd) {
        if (!cmd.isCommand()) return;
        const { commandName: name } = cmd;
        const cmdClass = require('./class.json')[name];
        const cmdFile = require(`./commands/${cmdClass}/${name}`);
        if (cmdFile.ownerOnly && cmd.user.id != ownerId) {
            cmd.reply('這個指令只有擁有者才能使用');
        } else {
            cmdFile.do(cmd);
        }
    }
};