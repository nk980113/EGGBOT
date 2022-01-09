const { MessageButton } = require('discord.js');

module.exports = userId =>
    new MessageButton()
        .setCustomId(`Shal ${userId}`)
        .setStyle('SECONDARY')
        .setLabel('回到大門');