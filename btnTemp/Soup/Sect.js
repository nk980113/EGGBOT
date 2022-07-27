const { MessageButton } = require('discord.js');

module.exports = (userId, soupId) =>
    new MessageButton()
        .setCustomId(`Sect ${userId} ${soupId}   `)
        .setLabel('編輯內容')
        .setStyle('SUCCESS');