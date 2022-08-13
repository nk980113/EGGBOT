const { SlashCommandBuilder } = require('@discordjs/builders');
const handleSoup = require('../../turtle-soup/handle_soup');
module.exports = {
    'turtle-soup': {
        data: new SlashCommandBuilder()
            .setName('turtle-soup')
            .setDescription('開啟海龜湯系統的大門'),
        test: true,
        async do(cmd) {
            await handleSoup(cmd);
        },
    },
};