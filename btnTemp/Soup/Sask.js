const { MessageButton } = require('discord.js');

module.exports = (userId, soupId) =>
    new MessageButton()
        .setCustomId(`Sask ${userId} ${soupId}   `)
        .setLabel('提問')
        .setStyle('PRIMARY');