const { MessageEmbed } = require('discord.js');
const { join } = require('path');
const { ownerId } = require('../config.json');
module.exports = {
    name: 'interactionCreate',
    do: [
        /**
         * @param {import('discord.js').Interaction} cmd
         */
        cmd => {
            if (!cmd.isCommand()) return;
            const { commandName: name } = cmd;
            delete require.cache[join(__dirname, 'class.json')];
            const cmdClass = require('./class.json').cmds[name];
            if (!cmdClass) return cmd.reply('未找到此指令，請使用/report指令回報');
            delete require.cache[join(__dirname, 'commands', cmdClass)];
            const cmdFile = require(`./commands/${cmdClass}`);
            if (cmdFile.ownerOnly && cmd.user.id != ownerId) {
                cmd.reply('這個指令只有擁有者才能使用');
            } else try {
                cmdFile[name].do(cmd);
            } catch (e) {
                cmd.reply('產生錯誤，已自動回報至伺服器');
                cmd.client.channels.cache.get(require('../config.json').errorChannelId).send({
                    content: `<@!${require('../config.json').ownerId}`,
                    embeds: new MessageEmbed()
                        .setTitle(`野生的${e.name}出現了！`)
                        .setDescription(`錯誤訊息：${e.message}`)
                        .setFields({
                            name: '出現位置',
                            value: e?.fileName ? `${e?.fileName}${e?.lineNumber ? `:${e?.lineNumber}${e?.columnNumber ? `:${e?.columnNumber}` : ''}` : ''}` : '沒有這種東西',
                        }),
                });
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