const { MessageButton } = require('discord.js');
module.exports = (userId, pg) =>
    new MessageButton()
        .setCustomId(`Smod ${userId} ${pg}`)
        .setLabel('管理海龜湯')
        .setStyle('SUCCESS');