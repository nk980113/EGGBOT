const { MessageEmbed } = require('discord.js');

module.exports = (client, e) => {
    client.channels.cache.get(require('./setup/config.json').errorChannelId).send({
        content: `<@!${require('./setup/config.json').ownerId}>`,
        embeds: [new MessageEmbed()
            .setTitle(`野生的${e.name}出現了！`)
            .setDescription(`錯誤堆疊：${e.stack ? `\`\`\`${e.stack}\`\`\`` : '被Wampus當蛋糕吃掉了'}`)
            .addFields({
                name: '出現位置',
                value:
                    e?.fileName
                        ? `${e?.fileName}${e?.lineNumber
                            ? `:${e?.lineNumber}${e?.columnNumber
                                ? `:${e?.columnNumber}`
                                : ''}`
                            : ''}`
                        : '沒有這種東西',
            })
            .addFields({
                name: '錯誤訊息',
                value: e.message,
            }),
        ],
    });
};