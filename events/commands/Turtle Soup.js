const { SlashCommandBuilder } = require('@discordjs/builders');
const handleSoup = require('../../turtle-soup/handle_soup');
module.exports = {
    name: '海龜湯',
    description: '進入海龜湯系統的指令',
    'turtle-soup': {
        data: new SlashCommandBuilder().setDescription('開啟海龜湯系統的大門'),
        test: true,
        async do(cmd) {
            await handleSoup(cmd);
        },
    },
};