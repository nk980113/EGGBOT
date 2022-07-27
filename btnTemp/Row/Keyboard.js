const { MessageActionRow, MessageButton } = require('discord.js');

/**
 * @param {string} prefix
 * @param {string} id
 * @param {boolean} canPressBackspace
 * @param {boolean} canPressEnter
 * @returns {MessageActionRow[]}
 */
module.exports = (prefix, id, canPressBackspace, canPressEnter) => {
    const rows = [
        new MessageActionRow,
        new MessageActionRow,
        new MessageActionRow,
        new MessageActionRow,
    ];
    [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ].forEach((a, i) => a.forEach(n => rows[i].addComponents(
        new MessageButton()
            .setCustomId(`${prefix} enterId ${id}${n}`)
            .setLabel('' + n)
            .setStyle('PRIMARY'),
    )));
    rows[3]
        .addComponents(
            new MessageButton()
                .setCustomId(`${prefix} enterId ${canPressBackspace ? id.slice(0, -1) : ''}`)
                .setEmoji('◀')
                .setStyle('PRIMARY')
                .setDisabled(!canPressBackspace))
        .addComponents(
            new MessageButton()
                .setCustomId(`${prefix} enterId ${id}0`)
                .setLabel('0')
                .setStyle('PRIMARY'))
        .addComponents(
            new MessageButton()
                .setCustomId(`${prefix} enterId ${id} get`)
                .setEmoji('✅')
                .setStyle('PRIMARY')
                .setDisabled(!canPressEnter));
    return rows;
};