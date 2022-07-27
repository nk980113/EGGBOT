const { MessageEmbed, MessageActionRow } = require('discord.js');

module.exports = userId => ({
    embeds: [
        new MessageEmbed()
            .setColor('GREEN')
            .setTitle('海龜湯大門')
            .setDescription('請點選下方按鈕選擇要做的事情'),
    ],
    components: [
        new MessageActionRow()
            .addComponents(require('../btnTemp/Soup/Sfnd')(userId))
            .addComponents(require('../btnTemp/Soup/Sall')(userId, 0))
            .addComponents(require('../btnTemp/Soup/Smod')(userId, 0))
            .addComponents(require('../btnTemp/Soup/Shlp')(userId))
            .addComponents(require('../btnTemp/Gdel')(userId)),
    ],
});