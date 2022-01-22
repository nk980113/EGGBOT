const { MessageButton } = require('discord.js');
module.exports = (userId, pg) =>
    new MessageButton()
        .setCustomId(`Sall ${userId} ${pg}`)
        .setLabel('查看所有海龜湯')
        .setStyle('PRIMARY');
