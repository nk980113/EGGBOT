const request = require('../request');
const resolveImport = require('./resolveImport');
const view = resolveImport('./view');
const all = resolveImport('./all');
const mod = resolveImport('./mod');

/**
 * @param {import('discord.js').ButtonInteraction} oldBtn
 * @param {number} id
 * @param {string} from
 * @param {number} fromPage
 */
module.exports = async function del(oldBtn, id, from, fromPage) {
    const randomNum = (Math.random() * 1000).toFixed(3);
    await Promise.all([
        oldBtn.message.edit({
            embeds: [{
                color: 'RED',
                title: '做出這碗湯的廚師沒慌...他正在考慮要不要倒掉這碗湯...',
            }],
            components: [],
        }),
        oldBtn.showModal({
            customId: 'delsoup',
            title: '你理智線真的沒斷線嗎？給你30秒回答',
            components: [
                {
                    type: 'ACTION_ROW',
                    components: [{
                        type: 'TEXT_INPUT',
                        style: 'SHORT',
                        label: `請輸入下面的小數：${randomNum}`,
                        customId: 'verify',
                        placeholder: '喔不，你理智線好像斷線了',
                        required: true,
                    }],
                },
            ],
        }),
    ]);

    const resModal = await oldBtn.awaitModalSubmit({ time: 30_000, filter: (m) => m.user.id === oldBtn.user.id && m.customId === 'delsoup' })
        // eslint-disable-next-line no-empty-function
        .catch(() => {
            oldBtn.update = oldBtn.editReply;
            view(oldBtn, id, from, fromPage);
        });

    if (!resModal) return;
    /** @type {import('discord.js').Message} */
    let msg;
    if (resModal.fields.getTextInputValue('verify') !== randomNum) {
        msg = await resModal.update({
            embeds: [{
                color: 'RED',
                title: '笑死，你理智線斷線了，再思考一下吧',
            }],
            components: [{ type: 'ACTION_ROW', components: [{
                type: 'BUTTON',
                style: 'DANGER',
                customId: 'view',
                label: '回去啦',
            }] }],
            fetchReply: true,
        });
    } else {
        await resModal.deferUpdate();
        const data = await request({ resource: 'soup', method: 'delete', metadata: { soupId: id } });
        if (!data.success) {
            setImmediate(() => {
                throw data.error;
            });
            msg = await resModal.editReply({
                embeds: [{
                    color: 'RED',
                    title: '無法倒掉這碗湯',
                    description: '可惜了，這碗湯不讓我們倒掉',
                }],
                components: [{
                    type: 'ACTION_ROW',
                    components: [
                        {
                            type: 'BUTTON',
                            customId: 'delete',
                            style: 'SECONDARY',
                            label: '再試一次',
                        },
                    ],
                }],
                fetchReply: true,
            });
        } else {
            msg = await resModal.editReply({
                embeds: [{
                    color: 'BLUE',
                    title: '成功倒掉這碗湯',
                }],
                components: [{
                    type: 'ACTION_ROW',
                    components: [
                        {
                            type: 'BUTTON',
                            customId: 'back',
                            style: 'SUCCESS',
                            label: '回上頁',
                        },
                    ],
                }],
                fetchReply: true,
            });
        }
    }
    const newBtn = await msg.awaitMessageComponent({
        filter(btn) {
            if (btn.user.id !== oldBtn.user.id) {
                btn.reply({ content: '你不可使用此按鈕', ephemeral: true });
                return false;
            }
            return true;
        },
        time: 120_000,
    }).catch(() => {
        msg.edit({ components: msg.components[0].components[0].setDisabled(true) });
    });
    if (!newBtn) return;
    switch (newBtn.customId) {
        case 'view': {
            return await Promise.resolve().then(() => view(newBtn, id, from, fromPage));
        }

        case 'delete': {
            return await Promise.resolve().then(() => del(newBtn, id, from, fromPage));
        }

        case 'back': {
            if (from === 'all') return await Promise.resolve().then(() => all(newBtn, fromPage));
            if (from === 'mod') return await Promise.resolve().then(() => mod(newBtn, fromPage));
        }
    }
};
