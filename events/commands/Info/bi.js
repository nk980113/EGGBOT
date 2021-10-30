const { SlashCommandBuilder } = require('@discordjs/builders');
const sleep = require('util').promisify(setTimeout);
module.exports = {
    data: new SlashCommandBuilder().setName('bi').setDescription('查看機器人的資訊'),
    async do(cmd) {
        const package = require('../../../package.json');
        await cmd.deferReply();
        await sleep(500);
        await cmd.editReply('`版本`:`β ' + package.version + '`\n`創造者`:eggeggegg#1278\n`官網`: 建造中 \n`使用套件版本`:discord.js v' + package.dependencies['discord.js'].replace('^', '')); // https://sites.google.com/view/eggbotsblogger
    }
};