const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports = {
    ping: {
        data: new SlashCommandBuilder().setName('ping').setDescription('測量機器人的延遲'),
        async do(cmd) {
            const msg = await cmd.reply({ content: '測量中...', fetchReply: true });
            cmd.editReply(`WS週期：${cmd.client.ws.ping}\nI/O週期：${msg.createdTimestamp - cmd.createdTimestamp}`);
        },
    },
    refresh: {
        data: new SlashCommandBuilder().setName('refresh').setDescription('Owner only command'),
        ownerOnly: true,
        do(cmd) {
            require('../../setup/refreshClient')(cmd.client);
            cmd.reply('成功整理斜線指令');
        },
    },
    report: {
        data: new SlashCommandBuilder()
            .setName('report')
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
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setTitle('錯誤回報')
                        .setDescription(`By ${cmd.user.tag}${cmd.guild ? ` from ${cmd.guild.name}` : ''}\n${'```'}${txt}${'```'}`),
                ],
            });
            cmd.reply({ content: '成功回報', ephemeral: true });
        },
    },
    suggest: {
        data: new SlashCommandBuilder()
            .setName('suggest')
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
                embeds: [
                    new MessageEmbed()
                        .setColor('GOLD')
                        .setTitle('建議')
                        .setDescription(`By ${cmd.user.tag}${cmd.guild ? ` from ${cmd.guild.name}` : ''}\n${'```'}${txt}${'```'}`),
                ],
            });
            cmd.reply({ content: '成功建議', ephemeral: true });
        },
    },
};