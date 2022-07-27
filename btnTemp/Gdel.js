const { MessageButton } = require('discord.js');
module.exports = userId =>
    new MessageButton()
        .setCustomId(`Gdel ${userId}`)
        .setLabel('刪除訊息')
        .setStyle('DANGER');