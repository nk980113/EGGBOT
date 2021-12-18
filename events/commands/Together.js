const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
module.exports = {
    together: {
        data: new SlashCommandBuilder().setName('together').setDescription('使用discord-together套件提供的功能'),
        test: true,
        do(cmd) {
            if (!cmd.guild) return cmd.reply('在伺服器中才能使用此指令');
            cmd.reply({
                content: '好吧，選一項',
                components: [
                    new MessageActionRow().addComponents(
                        new MessageSelectMenu()
                            .setCustomId('Toge')
                            .setPlaceholder('你要確定你有選欸')
                            .setMinValues(1)
                            .setMaxValues(1)
                            .addOptions([
                                {
                                    label: 'YT',
                                    description: '連上YouTube啦，不然音樂機器人快滅團了',
                                    value: 'youtube',
                                },
                                {
                                    label: '西洋棋',
                                    description: '來玩有點西洋味兒的東西',
                                    value: 'chess',
                                },
                                {
                                    label: '離開',
                                    description: '如果你今天沒興趣的話可以點這',
                                    value: 'leave',
                                },
                            ]),
                    ),
                ],
            });
        },
    },
};