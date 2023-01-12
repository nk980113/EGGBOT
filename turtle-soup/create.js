const request = require('../request');
const resolveImport = require('./resolveImport');
const view = resolveImport('./view');

/**
 * @param {import('discord.js').ButtonInteraction} oldBtn
 */
module.exports = async function create(oldBtn) {
    await Promise.all([
        oldBtn.message.edit({
            embeds: [{
                color: 'GREY',
                title: '正在創建海龜湯',
                description: '請於10分鐘內輸入完畢',
            }],
            components: [],
        }),
        oldBtn.showModal({
            customId: 'createsoup',
            title: '煮一碗湯',
            components: [
                {
                    type: 'ACTION_ROW',
                    components: [{
                        type: 'TEXT_INPUT',
                        style: 'SHORT',
                        label: '標題',
                        customId: 'title',
                        minLength: 2,
                        maxLength: 250,
                        placeholder: '字數必須介於2~250之間',
                        required: true,
                    }],
                },
                {
                    type: 'ACTION_ROW',
                    components: [{
                        type: 'TEXT_INPUT',
                        style: 'PARAGRAPH',
                        label: '內容',
                        customId: 'content',
                        required: true,
                        placeholder: '打上你的海龜湯內容',
                    }],
                },
                {
                    type: 'ACTION_ROW',
                    components: [{
                        type: 'TEXT_INPUT',
                        style: 'PARAGRAPH',
                        label: '答案',
                        customId: 'answer',
                        required: true,
                        placeholder: '打上你的海龜湯謎底',
                    }],
                },
            ],
        }),
    ]);
    const soupModal = await oldBtn.awaitModalSubmit({ time: 600_000, filter: (m) => m.user.id === oldBtn.user.id && m.customId === 'createsoup' })
        // eslint-disable-next-line no-empty-function
        .catch(() => { });

    if (!soupModal) return;
    await soupModal.deferUpdate();
    const title = soupModal.fields.getTextInputValue('title');
    const data = await request({ resource: 'soup', method: 'create', metadata: {
        title,
        content: soupModal.fields.getTextInputValue('content'),
        answer: soupModal.fields.getTextInputValue('answer'),
        authorId: oldBtn.user.id,
    } });
    /** @type {import('discord.js').Message} */
    let msg;
    if (!data.success) {
        setImmediate(() => {
            throw data.error;
        });
        msg = await soupModal.editReply({
            embeds: [{
                color: 'RED',
                title: `${title}發布失敗`,
            }],
            components: [{
                type: 'ACTION_ROW',
                components: [
                    {
                        type: 'BUTTON',
                        customId: 'create',
                        style: 'SECONDARY',
                        label: '再試一次',
                    },
                ],
            }],
            fetchReply: true,
        });
    } else {
        msg = await soupModal.editReply({
            embeds: [{
                color: 'BLUE',
                title: `${title}發布成功`,
            }],
            components: [{
                type: 'ACTION_ROW',
                components: [
                    {
                        type: 'BUTTON',
                        customId: 'view',
                        style: 'SUCCESS',
                        label: '看這碗湯',
                    },
                ],
            }],
            fetchReply: true,
        });
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
            return await Promise.resolve().then(() => view(newBtn, data.metadata.soupId, 'mod', 0));
        }

        case 'create': {
            return await Promise.resolve(newBtn).then(create);
        }
    }
};
