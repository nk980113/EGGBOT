const { MessageButton } = require('discord.js');

module.exports = userId =>
    new MessageButton()
        .setCustomId(`Cmlv ${userId}`)
        .setLabel('確認離開')
        .setStyle('DANGER');
