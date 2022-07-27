const { MessageButton } = require('discord.js');

module.exports = (userId, soupId) =>
    new MessageButton()
        .setCustomId(`Seti ${userId} ${soupId}   `)
        .setLabel('編輯標題')
        .setStyle('SUCCESS');