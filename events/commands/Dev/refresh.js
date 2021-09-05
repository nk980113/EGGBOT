const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder().setName('refresh').setDescription('Owner only command'),
    ownerOnly: true, // Set the command to Owner only 設定指令為擁有者專用
    do(cmd) {
        require('../../../refresh')();
        cmd.reply('成功整理斜線指令');
    }
};