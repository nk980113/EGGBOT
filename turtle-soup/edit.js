const { soup } = require('../DB/soup');
const resolveImport = require('./resolveImport');
const view = resolveImport('./view');

/**
 * @param {import('discord.js').ButtonInteraction} oldBtn
 * @param {number} id
 * @param {string} from
 * @param {number} fromPage
 */
module.exports = async function edit(oldBtn, id, from, fromPage) {
    const foundSoup = soup.entries.find((s) => s.soupId === id);
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
        .catch(() => {});

    if (!soupModal) return;

    foundSoup.title = soupModal.fields.getTextInputValue('title');
    foundSoup.content = soupModal.fields.getTextInputValue('content');
    foundSoup.answer = soupModal.fields.getTextInputValue('answer');
    /*
    let maxId = Math.max(...soup.entries.map((s) => s.soupId));
    if (!Number.isFinite(maxId)) maxId = 0;
    const title = soupModal.fields.getTextInputValue('title');
    soup.entries.push({
        soupId: ++maxId,
        publicAnswer: false,
        title,
        content: soupModal.fields.getTextInputValue('content'),
        answer: soupModal.fields.getTextInputValue('answer'),
        authorId: oldBtn.user.id,
    });
    */
    /** @type {import('discord.js').Message} */
    const msg = await soupModal.update({
        embeds: [{
            color: 'BLUE',
            title: `${foundSoup.title}發布成功`,
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
    const viewBtn = await msg.awaitMessageComponent({
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
    if (!viewBtn) return;
    return await view(viewBtn, id, from, fromPage);
};