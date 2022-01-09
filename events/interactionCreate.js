const { MessageEmbed } = require('discord.js');
const { join } = require('path');
const { ownerId } = require('../setup/config.json');

const classJsonPath = join(__dirname, 'class.json');
const errorHandle = async (cb, inter) => {
    try {
        return await cb();
    } catch (e) {
        await inter.reply('產生錯誤，已自動回報至伺服器');
        inter.client.channels.cache.get(require('../setup/config.json').reportChannelId).send({
            content: `<@!${require('../setup/config.json').ownerId}>`,
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
};

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
            } else errorHandle(() => cmdFile[name].do(cmd), cmd);
        },
        /**
         * @param {import('discord.js').Interaction} btn
         */
        btn => {
            if (!btn.isButton()) return;
            const id = btn.customId.split(' ')[1];
            if (id !== btn.user.id) return btn.reply('你不可使用此按鈕！');
            const pref = btn.customId.slice(0, 4);
            delete require.cache[classJsonPath];
            const fileName = require('./class.json').btns[pref];
            errorHandle(() => require(`./buttons/${fileName}`)(btn), btn);
        },
        menu => {
            if (!menu.isSelectMenu()) return;
            const pref = menu.customId.slice(0, 4);
            delete require.cache[classJsonPath];
            const fileName = require('./class.json').menus[pref];
            errorHandle(require(`./menus/${fileName}`)(menu), menu);
        },
    ],
};