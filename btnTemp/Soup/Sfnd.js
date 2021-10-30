const { MessageButton } = require('discord.js');
module.exports = 
    new MessageButton()
        .setCustomId('Sfnd')
        .setLabel('搜尋海龜湯')
        .setStyle('SECONDARY')
        .setDisabled(true);