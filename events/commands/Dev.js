const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    ping: {
        data: new SlashCommandBuilder().setName('ping').setDescription('測量機器人的延遲'),
        async do(cmd) {
            const { createdTimestamp } = await cmd.reply({ content: `WS週期：${cmd.client.ws.ping}`, fetchReply: true });
            cmd.followUp(`完整週期：${createdTimestamp - cmd.createdTimestamp}`);
        },
    },
    refresh: {
        data: new SlashCommandBuilder().setName('refresh').setDescription('Owner only command'),
        ownerOnly: true,
        do(cmd) {
            require('../../refresh')();
            cmd.reply('成功整理斜線指令');
        },
    },
};