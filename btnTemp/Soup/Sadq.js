const { MessageButton } = require('discord.js');

module.exports = userId =>
    new MessageButton()
        .setCustomId(`Sadq ${userId}`)
        .setStyle('PRIMARY')
        .setLabel('煮一碗湯');