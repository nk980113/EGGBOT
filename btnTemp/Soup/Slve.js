const { MessageButton } = require('discord.js');
module.exports = userId =>
    new MessageButton()
        .setCustomId(`Slve ${userId}`)
        .setLabel('離開')
        .setStyle('DANGER')
        .setDisabled(true);