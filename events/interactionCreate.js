const { join } = require('path');
const { ownerId } = require('../config.json');
module.exports = {
    name: 'interactionCreate',
    do: [
        cmd => {
            if (!cmd.isCommand()) return;
            const { commandName: name } = cmd;
            delete require.cache[join(__dirname, 'class.json')];
            const cmdClass = require('./class.json').cmds[name];
            const cmdFile = require(`./commands/${cmdClass}`);
            if (cmdFile.ownerOnly && cmd.user.id != ownerId) {
                cmd.reply('這個指令只有擁有者才能使用');
            } else {
                cmdFile[name].do(cmd);
            }
        },
        btn => {
            if (!btn.isButton()) return;
            // building
            // eslint-disable-next-line no-unused-vars
            const pref = btn.customId.slice(0, 4);
        },
        menu => {
            if (!menu.isSelectMenu()) return;
            const pref = menu.customId.slice(0, 4);
            const fileName = require('./class.json').menus[pref];
            require(`./menus/${fileName}`)(menu);
        },
    ],
};