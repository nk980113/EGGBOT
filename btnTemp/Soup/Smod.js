const { MessageButton } = require('discord.js');
module.exports = userId =>
    new MessageButton()
        .setCustomId(`Smod ${userId}`)
        .setLabel('管理海龜湯')
        .setStyle('SUCCESS')
        .setDisabled(true);