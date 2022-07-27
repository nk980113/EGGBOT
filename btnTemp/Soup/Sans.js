const { MessageButton } = require('discord.js');

module.exports = (userId, soupId, pg) =>
    new MessageButton()
        .setCustomId(`Sans ${userId} ${soupId} ${pg}`)
        .setLabel('查看所有提問')
        .setStyle('SECONDARY');