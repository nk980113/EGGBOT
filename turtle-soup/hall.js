const help = require('./help');

/**
 * @param {import('discord.js').ButtonInteraction} oldBtn
 */
module.exports = async function hall(oldBtn) {
    const msg = await oldBtn.update({
        embeds: [{
            color: 'GREEN',
            title: '海龜湯大門',
            description: '請點選下方按鈕選擇要做的事情',
        }],
        components: [{ type: 'ACTION_ROW', components: [
            {
                type: 'BUTTON',
                customId: 'unavailable',
                label: '搜尋海龜湯(尚未開放)',
                style: 'SECONDARY',
                disabled: true,
            },
            {
                type: 'BUTTON',
                customId: 'all',
                label: '查看所有海龜湯',
                style: 'PRIMARY',
                disabled: true,
            },
            {
                type: 'BUTTON',
                customId: 'mod',
                label: '管理海龜湯',
                style: 'SUCCESS',
                disabled: true,
            },
            {
                type: 'BUTTON',
                customId: 'help',
                label: '幫助',
                style: 'SECONDARY',
            },
            {
                type: 'BUTTON',
                customId: 'leave',
                label: '離開',
                style: 'DANGER',
                disabled: true,
            },
        ] }],
        fetchReply: true,
    });
    const receivedBtn = await msg.awaitMessageComponent({
        filter(btn) {
            if (btn.user.id !== oldBtn.user.id) {
                btn.reply({ content: '你不可使用此按鈕', ephemeral: true });
                return false;
            }
            return true;
        },
        time: 120_000,
    }).catch(() => {
        msg.edit({ components: [{ type: 'ACTION_ROW', components: msg.components[0].components.map((btn) => btn.disabled = true) }] });
    });
    if (!receivedBtn) return;
    switch (receivedBtn.customId) {
        case 'help': {
            await help(receivedBtn);
        }
    }
};