const logger = require('./logger');
const config = require('./setup/config.json');

// TODO: use webhook
module.exports = (client, e) => {
    client.channels.cache.get(config.errorChannelId).send({
        content: `<@!${config.ownerId}>`,
        embeds: [{
            title: `野生的${e.name}出現了！`,
            description: `錯誤堆疊：${e.stack ? `\`\`\`${e.stack}\`\`\`` : '被Wumpus當蛋糕吃掉了'}`,
            fields: [
                {
                    name: '出現位置',
                    value:
                        e?.fileName
                            ? `${e?.fileName}${e?.lineNumber
                                ? `:${e?.lineNumber}${e?.columnNumber
                                    ? `:${e?.columnNumber}`
                                    : ''}`
                                : ''}`
                            : '沒有這種東西',
                },
                {
                    name: '錯誤訊息',
                    value: e.message,
                },
            ],
        }],
    }).then((msg) => logger.error(`View error message on https://discord.com/channels/${config.guildId}/${config.errorChannelId}/${msg.id}`));
};