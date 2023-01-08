const resolveImport = require('./resolveImport');
const help = resolveImport('./help');
const mod = resolveImport('./mod');
const all = resolveImport('./all');

/**
 * @param {import('discord.js').CommandInteraction} cmd
 */
module.exports = async function handleSoup(cmd) {
    const msg = await cmd.reply({
        embeds: [{
            color: 'GREEN',
            title: '海龜湯大門',
            description: '請點選下方按鈕選擇要做的事情\n**註：須將Discord更新到2022年2月之後的版本才能使用此功能**',
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
            },
            {
                type: 'BUTTON',
                customId: 'mod',
                label: '管理海龜湯',
                style: 'SUCCESS',
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
            },
        ] }],
        content: '模式參照 [GS遊戲學校](http://gameschool.cc/) ，在這邊要跟站長Pheion說聲抱歉了~',
        fetchReply: true,
    });
    const receivedBtn = await msg.awaitMessageComponent({
        filter(btn) {
            if (btn.user.id !== cmd.user.id) {
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
    switch (receivedBtn.customId) {
        case 'help': {
            return await Promise.resolve(receivedBtn).then(help);
        }

        case 'leave': {
            return await receivedBtn.update({ content: '881', components: [], embeds: [{
                title: '成功離開',
                color: 'RED',
            }], fetchReply: true }).then((m) => setTimeout(() => m.delete(), 1_000));
        }

        case 'mod': {
            return await Promise.resolve(receivedBtn).then(mod);
        }

        case 'all': {
            return await Promise.resolve(receivedBtn).then(all);
        }
    }
};