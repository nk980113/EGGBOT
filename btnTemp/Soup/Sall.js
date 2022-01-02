const { MessageButton } = require('discord.js');
module.exports =
    new MessageButton()
        .setCustomId('Sall')
        .setLabel('查看所有海龜湯')
        .setStyle('PRIMARY')
        .setDisabled(true);