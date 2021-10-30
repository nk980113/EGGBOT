const { MessageButton } = require('discord.js');
module.exports = 
    new MessageButton()
        .setCustomId('Smod')
        .setLabel('管理海龜湯')
        .setStyle('SUCCESS')
        .setDisabled(true)