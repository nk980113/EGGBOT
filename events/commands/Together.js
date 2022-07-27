const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { DiscordTogether } = require('discord-together');
module.exports = {
    together: {
        data: new SlashCommandBuilder().setName('together').setDescription('使用discord-together套件提供的功能'),
        test: true,
        /**
         * @param {import('discord.js').CommandInteraction} cmd
         */
        async do(cmd) {
            if (!cmd.guild) return cmd.reply('在伺服器中才能使用此指令');
            /** @type {import('discord.js').Message} */
            const original = await cmd.reply({
                content: '好吧，選一項',
                components: [
                    new MessageActionRow().addComponents(
                        new MessageSelectMenu()
                            .setCustomId('a')
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
                fetchReply: true,
            });

            const collector = original.createMessageComponentCollector({
                componentType: 'SELECT_MENU',
                time: 60_000,
                filter: (menu) => menu.user.id == cmd.user.id,
            });
            collector.once('collect', async (menu) => {
                if (menu.values.includes('leave')) {
                    menu.message.edit({ content: '881', components: [] }).then(() => setTimeout(() => {
                        menu.message.delete();
                    }, 1_000));
                    return collector.stop();
                }

                if (!menu.member.voice.channel?.id) {
                    menu.message.edit({ content: '給我悔過，重新使用指令！連讓我發揮的機會都沒有...', components: [] }).then(() => setTimeout(() => {
                        menu.message.delete();
                    }, 1_000));
                    return collector.stop();
                }
                const dcTogether = new DiscordTogether(menu.client);
                const { code } = await dcTogether.createTogetherCode(menu.member.voice.channel.id, menu.values[0]);
                menu.message.edit({ content: `你的活動代碼：${code}\n記得，是按連結，不是按綠色按鈕`, components: [] });
                return collector.stop();
            });
        },
    },
};