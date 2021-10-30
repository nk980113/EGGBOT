const { MessageButton } = require('discord.js');
module.exports = 
    new MessageButton()
        .setCustomId('Shlp')
        .setLabel('幫助')
        .setStyle('SECONDARY')
        .setDisabled(true)