const { setTimeout } = require('node:timers');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Util } = require('discord.js');
const dayjs = require('dayjs');
const logger = require('../../logger');
module.exports = {
    name: '開發者事項',
    description: '關於機器人開發的一些指令',
    ping: {
        data: new SlashCommandBuilder().setDescription('測量機器人的延遲'),
        async do(cmd) {
            const msg = await cmd.reply({ content: '測量中...', fetchReply: true });
            cmd.editReply(`WS週期(對Discord伺服器的延遲)：${cmd.client.ws.ping}\nI/O週期(從輸入指令到機器人回應的延遲)：${msg.createdTimestamp - cmd.createdTimestamp}`);
        },
    },
    refresh: {
        data: new SlashCommandBuilder().setDescription('Owner only command'),
        ownerOnly: true,
        do(cmd) {
            require('../../setup/refreshClient')(cmd.client);
            cmd.reply('成功整理斜線指令');
        },
    },
    shutdown: {
        data: new SlashCommandBuilder().setDescription('Owner only command'),
        ownerOnly: true,
        async do(cmd) {
            cmd.reply('機器人將在三秒後下線');
            setTimeout(() => {
                cmd.client.destroy();
                logger.info('Manual exit through /shutdown command', true);
                process.exit();
            }, 3000).unref();
        },
    },
    report: {
        data: new SlashCommandBuilder()
            .setDescription('回報錯誤到伺服器')
            .addStringOption(op => op
                .setName('text')
                .setDescription('欲回報的事項')
                .setRequired(true)),
        /**
         * @param {import('discord.js').CommandInteraction} cmd
         */
        async do(cmd) {
            const txt = cmd.options.getString('text');
            cmd.client.channels.cache.get(require('../../setup/config.json').reportChannelId).send({
                content: `<@!${require('../../setup/config.json').ownerId}>`,
                embeds: [{
                    color: 'RED',
                    title: '錯誤回報',
                    description: `By ${cmd.user.tag}${cmd.guild ? ` from ${cmd.guild.name}` : ''}\n${'```'}${Util.escapeCodeBlock(txt)}${'```'}`,
                }],
            });
            cmd.reply({ content: '成功回報', ephemeral: true });
        },
    },
    suggest: {
        data: new SlashCommandBuilder()
            .setDescription('發送建議到伺服器')
            .addStringOption(op => op
                .setName('text')
                .setDescription('欲建議的事項')
                .setRequired(true)),
        /**
         * @param {import('discord.js').CommandInteraction} cmd
         */
        async do(cmd) {
            const txt = cmd.options.getString('text');
            cmd.client.channels.cache.get(require('../../setup/config.json').suggestChannelId).send({
                content: `<@!${require('../../setup/config.json').ownerId}>`,
                embeds: [{
                    color: 'GOLD',
                    title: '建議',
                    description: `By ${cmd.user.tag}${cmd.guild ? ` from ${cmd.guild.name}` : ''}\n${'```'}${Util.escapeCodeBlock(txt)}${'```'}`,
                }],
            });
            cmd.reply({ content: '成功建議', ephemeral: true });
        },
    },
    invite: {
        data: new SlashCommandBuilder()
            .setDescription('查看邀請連結'),
        /**
         * @param {import('discord.js').CommandInteraction} cmd
         */
        async do(cmd) {
            cmd.reply({
                embeds: [{
                    color: 'RANDOM',
                    title: '按我邀請',
                    url: 'https://discord.com/api/oauth2/authorize?client_id=832969224854175744&permissions=16384&scope=bot%20applications.commands',
                    description: '使用此機器人代表你同意機器人的[使用條款](https://sites.google.com/view/eggbotsblogger/tos)',
                }],
            });
        },
    },
    'get-log': {
        data: new SlashCommandBuilder()
            .setDescription('Owner only command'),
        ownerOnly: true,
        async do(cmd) {
            const log = logger.getLog();
            if (log.length === 0) await cmd.reply('笑死，你把紀錄都清空了');
            else await cmd.reply({
                embeds: [{
                    fields: [
                        ...log.map(({ type, msg, timestamp }) => ({ name: `${type.toUpperCase()} ${dayjs(timestamp).format('YYYY/MM/DD HH:mm:ss')}`, value: msg })),
                    ],
                }],
            });
        },
    },
};
