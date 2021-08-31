const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder().setName('refresh').setDescription('Owner only command'),
    ownerOnly: true,
    do(cmd) {
        const r = require('../../../refresh');
        console.log(r);
        r();
        cmd.reply('成功整理斜線指令');
    }
};