const resolveImport = require('./resolveImport');
const hall = resolveImport('./hall');

/**
 * @param {import('discord.js').ButtonInteraction} oldBtn
 */
module.exports = async function help(oldBtn) {
    const msg = await oldBtn.update({
        ephemeral: true,
        embeds: [{
            color: 'RANDOM',
            title: '幫助——海龜湯',
            description: '海龜湯介紹： http://gameschool.cc/game/category/11/wiki/intro/',
            fields: [
                {
                    name: '搜尋海龜湯：',
                    value: '以關鍵字搜尋海龜湯，-會被當成空格，空格用來分隔關鍵字。',
                },
                {
                    name: '查看所有海龜湯：',
                    value: '查看所有海龜湯，可選擇排序方式',
                },
                {
                    name: '管理海龜湯：',
                    value: '可在此處編輯你所有的海龜湯',
                },
                {
                    name: '幫助：',
                    value: '你應該已經點過這個鍵了吧？',
                },
            ],
        }],
        components: [{ type: 'ACTION_ROW', components: [
            {
                type: 'BUTTON',
                customId: 'a',
                style: 'SECONDARY',
                label: '回到大門',
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
        msg.edit({ components: [{ type: 'ACTION_ROW', components: msg.components[0].components.map((btn) => {
            btn.disabled = true;
            return btn;
        }) }] });
    });
    if (!receivedBtn) return;
    await Promise.resolve(receivedBtn).then(hall);
};