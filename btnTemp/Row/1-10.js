const { MessageActionRow, MessageButton } = require('discord.js');


module.exports = (cmd, userId, args, disableVal) => {
    const row1 = new MessageActionRow;
    [1, 2, 3, 4, 5].forEach(v => {
        row1.addComponents(
            new MessageButton()
                .setCustomId(`${cmd} ${userId} ${args} ${v}`)
                .setStyle('PRIMARY')
                .setLabel(`${v}`)
                .setDisabled(disableVal <= v));
    });
    const row2 = new MessageActionRow;
    [6, 7, 8, 9, 10].forEach(v => {
        row2.addComponents(
            new MessageButton()
                .setCustomId(`${cmd} ${userId} ${args} ${v}`)
                .setStyle('PRIMARY')
                .setLabel(`${v}`)
                .setDisabled(disableVal <= v));
    });
    return [row1, row2];
};