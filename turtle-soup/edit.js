const request = require('../request');
const resolveImport = require('./resolveImport');
const view = resolveImport('./view');

/**
 * @param {import('discord.js').ButtonInteraction} oldBtn
 * @param {number} id
 * @param {string} from
 * @param {number} fromPage
 */
module.exports = async function edit(oldBtn, id, from, fromPage) {
    const soupData = await request({ resource: 'soup', method: 'findbyid', metadata: { id } });
    /** @type {import('discord.js').Message} */
    let msg;
    if (!soupData.success) {
        setImmediate(() => {
            throw soupData.error;
        });
        msg = await oldBtn.update({
            embeds: [{
                color: 'RED',
                title: '機器人在龐大資料庫中迷路了',
            }],
            components: [{
                type: 'ACTION_ROW',
                components: [
                    {
                        type: 'BUTTON',
                        customId: 'edit',
                        style: 'SECONDARY',
                        label: '再試一次',
                    },
                ],
            }],
            fetchReply: true,
        });
    } else {
        const foundSoup = soupData.metadata;
        await Promise.all([
            oldBtn.message.edit({
                embeds: [{
                    color: 'GREY',
                    title: '正在編輯海龜湯',
                    description: '請於10分鐘內輸入完畢',
                }],
                components: [],
            }),
            oldBtn.showModal({
                customId: 'editsoup',
                title: '給這碗湯加料',
                components: [
                    {
                        type: 'ACTION_ROW',
                        components: [{
                            type: 'TEXT_INPUT',
                            style: 'SHORT',
                            label: '標題',
                            customId: 'title',
                            minLength: 2,
                            maxLength: 30,
                            placeholder: '字數必須介於2~30之間',
                            value: foundSoup.title,
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
                            value: foundSoup.content,
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
                            value: foundSoup.answer,
                            placeholder: '打上你的海龜湯謎底',
                        }],
                    },
                ],
            }),
        ]);
        const soupModal = await oldBtn.awaitModalSubmit({ time: 600_000, filter: (m) => m.user.id === oldBtn.user.id && m.customId === 'editsoup' })
            // eslint-disable-next-line no-empty-function
            .catch(() => { });

        if (!soupModal) return;
        await soupModal.deferUpdate();
        const title = soupModal.fields.getTextInputValue('title');
        const data = await request({
            resource: 'soup', method: 'edit', metadata: {
                soupId: id,
                title,
                content: soupModal.fields.getTextInputValue('content'),
                answer: soupModal.fields.getTextInputValue('answer'),
            },
        });
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
                            customId: 'edit',
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

        case 'edit': {
            return await Promise.resolve().then(() => edit(newBtn, id, from, fromPage));
        }
    }
};