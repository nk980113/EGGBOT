const { MessageButton } = require('discord.js');

module.exports = (userId, ...args) =>
    new MessageButton()
        .setCustomId(`Sadq ${userId} ${args.join(' ')}`)
        .setStyle('PRIMARY')
        .setLabel('煮一碗湯');