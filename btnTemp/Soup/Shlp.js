const { MessageButton } = require('discord.js');
module.exports = userId =>
    new MessageButton()
        .setCustomId(`Shlp ${userId}`)
        .setLabel('幫助')
        .setStyle('SECONDARY')
        .setDisabled(true);