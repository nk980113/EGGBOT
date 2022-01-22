const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    'turtle-soup': {
        data: new SlashCommandBuilder()
            .setName('turtle-soup')
            .setDescription('開啟海龜湯系統的大門'),
        test: true,
        /**
         * @param {import('discord.js').CommandInteraction} cmd
         */
        do(cmd) {
            cmd.reply({
                ...require('../../msgTemp/turtle-soup')(cmd.user.id),
                content: '模式參照 [GS遊戲學校](http://gameschool.cc/) ，在這邊要跟站長Pheion說聲抱歉了~',
            });
        },
    },
};