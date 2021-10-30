const { MessageButton } = require('discord.js');
module.exports = 
    new MessageButton()
        .setCustomId('Slve')
        .setLabel('離開')
        .setStyle('DANGER')
        .setDisabled(true)