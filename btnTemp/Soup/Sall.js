const { MessageButton } = require('discord.js');
module.exports = userId =>
    new MessageButton()
        .setCustomId(`Sall ${userId}`)
        .setLabel('查看所有海龜湯')
        .setStyle('PRIMARY')
        .setDisabled(true);
