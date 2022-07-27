const { MessageButton } = require('discord.js');
module.exports = userId =>
    new MessageButton()
        .setCustomId(`Sfnd ${userId}`)
        .setLabel('搜尋海龜湯(尚未開放)')
        .setStyle('SECONDARY')
        .setDisabled(true);