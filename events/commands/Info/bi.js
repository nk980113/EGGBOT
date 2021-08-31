const { SlashCommandBuilder } = require('@discordjs/builders');
const sleep = require('util').promisify(setTimeout);
module.exports = {
    data: new SlashCommandBuilder().setName('bi').setDescription('查看機器人的資訊'),
    async do(cmd) {
        await cmd.deferReply({ephemeral: true});
        await sleep(500);
        await cmd.editReply('`版本`:Beta `β`\n`創造者`:eggeggegg#1278\n`官網`: https://sites.google.com/view/eggbotsblogger \n`使用套件版本`:discord.js v13.1.0');
    }
};