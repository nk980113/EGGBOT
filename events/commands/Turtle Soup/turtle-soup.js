const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, CommandInteraction } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder().setName('turtle-soup').setDescription('開啟海龜湯系統的大門'),
    test: true,
    /**
     * 
     * @param {CommandInteraction} cmd 
     */
    do(cmd) {
        cmd.reply({
            content:'模式參照 [GS遊戲學校](http://gameschool.cc/) ，在這邊要跟站長Pheion說聲抱歉了~',
            embeds: [
                new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle('海龜湯大門')
                    .setDescription('請點選下方按鈕選擇要做的事情')
            ],
            components: [
                new MessageActionRow()
                    .addComponents(require('../../../btnTemp/Soup/Sfnd'))
                    .addComponents(require('../../../btnTemp/Soup/Sall'))
                    .addComponents(require('../../../btnTemp/Soup/Smod'))
                    .addComponents(require('../../../btnTemp/Soup/Shlp'))
                    .addComponents(require('../../../btnTemp/Soup/Slve'))
            ]
        });
    }
};