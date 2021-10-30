const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('測量機器人的延遲'),
    test: true,
    async do(cmd) {
        const { createdTimestamp } = await cmd.reply({ content: `WS週期：${cmd.client.ws.ping}`, fetchReply: true });
        cmd.followUp(`完整週期：${createdTimestamp - cmd.createdTimestamp}`);
    }
}