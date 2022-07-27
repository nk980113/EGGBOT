const { MessageButton } = require('discord.js');

module.exports = (userId, soupId) =>
    new MessageButton()
        .setStyle('PRIMARY')
        .setLabel('幫這碗湯加料')
        .setCustomId(`Sedi ${userId} ${soupId}`);