const { MessageButton } = require('discord.js');

module.exports = (userId, soupId) =>
    new MessageButton()
        .setCustomId(`Sean ${userId} ${soupId}   `)
        .setLabel('編輯答案')
        .setStyle('SUCCESS');