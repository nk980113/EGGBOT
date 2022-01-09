const { MessageButton } = require('discord.js');

module.exports = (userId, evt) =>
    new MessageButton()
        .setCustomId(`Back ${userId} ${evt}`)
        .setLabel('返回')
        .setStyle('SECONDARY');
