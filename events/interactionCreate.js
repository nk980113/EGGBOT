const { MessageEmbed } = require('discord.js');
const { join } = require('path');
const { ownerId } = require('../config.json');

const classJsonPath = join(__dirname, 'class.json');

module.exports = {
    name: 'interactionCreate',
    do: [
        /**
         * @param {import('discord.js').Interaction} cmd
         */
        async cmd => {
            if (!cmd.isCommand()) return;
            const { commandName: name } = cmd;
            delete require.cache[classJsonPath];
            const cmdClass = require('./class.json').cmds[name];
            if (!cmdClass) return cmd.reply('未找到此指令，請使用/report指令回報');
            delete require.cache[join(__dirname, 'commands', cmdClass)];
            const cmdFile = require(`./commands/${cmdClass}`);
            if (cmdFile.ownerOnly && cmd.user.id != ownerId) {
                cmd.reply('這個指令只有擁有者才能使用');
            } else try {
                await cmdFile[name].do(cmd);
            } catch (e) {
                await cmd.reply('產生錯誤，已自動回報至伺服器');
                cmd.client.channels.cache.get(require('../config.json').reportChannelId).send({
                    content: `<@!${require('../config.json').ownerId}>`,
                    embeds: [new MessageEmbed()
                        .setTitle(`野生的${e.name}出現了！`)
                        .setDescription(`錯誤訊息：${e.message}`)
                        .setFields({
                            name: '出現位置',
                            value: e?.fileName ? `${e?.fileName}${e?.lineNumber ? `:${e?.lineNumber}${e?.columnNumber ? `:${e?.columnNumber}` : ''}` : ''}` : '沒有這種東西',
                        }),
                    ],
                });
            }
        },
        /**
         * @param {import('discord.js').Interaction} btn
         */
        btn => {
            if (!btn.isButton()) return;
            const id = btn.customId.split(' ')[1];
            /**
             * @type {import('discord.js').Message} msg
             */
            const msg = btn.message;
            if (id !== btn.user.id) return msg.edit({
                content: msg.content,
                embeds: msg.embeds,
                components: msg.components,
            });
            const pref = btn.customId.slice(0, 4);
            delete require.cache[classJsonPath];
            const fileName = require('./class.json').btns[pref];
            require(`./buttons/${fileName}`)(btn);
        },
        menu => {
            if (!menu.isSelectMenu()) return;
            const pref = menu.customId.slice(0, 4);
            delete require.cache[classJsonPath];
            const fileName = require('./class.json').menus[pref];
            require(`./menus/${fileName}`)(menu);
        },
    ],
};