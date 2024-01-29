const request = require('../request');
const resolveImport = require('./resolveImport');
const hall = resolveImport('./hall');
const all = resolveImport('./all');
const mod = resolveImport('./mod');
const edit = resolveImport('./edit');
const del = resolveImport('./delete');
const allAns = resolveImport('./all_ans');
const modAns = resolveImport('./mod_ans');

/**
 * @param {import('discord.js').ButtonInteraction} oldBtn
 * @param {number} id
 * @param {string} from
 * @param {number} fromPage
 */
module.exports = async function view(oldBtn, id, from, fromPage) {
    const soupData = await request({ resource: 'soup', method: 'findbyid', metadata: { id } });
    /** @type {import('discord.js').Message} */
    let msg;
    let answer;
    let title;

    if (!soupData.success) {
        setImmediate(() => {
            throw soupData.error;
        });
        msg = await oldBtn.editReply({
            embeds: [{
                color: 'RED',
                title: '機器人在龐大資料庫中迷路了',
            }],
            components: [{
                type: 'ACTION_ROW',
                components: [
                    {
                        type: 'BUTTON',
                        customId: 'hall',
                        style: 'SECONDARY',
                        label: '回到大門',
                    },
                ],
            }],
            fetchReply: true,
        });
    } else {
        const foundSoup = soupData.metadata;
        answer = foundSoup.answer;
        title = foundSoup.title;
        const author = await oldBtn.client.users.fetch(foundSoup.authorId);
        msg = await oldBtn.update({
            fetchReply: true,
            embeds: [{
                color: 'NAVY',
                title: `#${foundSoup.soupId} ${title}`,
                footer: {
                    text: `由${author.displayName}出題`,
                    iconURL: author.displayAvatarURL({ dynamic: true }),
                },
                description: foundSoup.content,
                timestamp: foundSoup.timestamp,
            }],
            components: [{
                type: 'ACTION_ROW',
                components: [
                    {
                        type: 'BUTTON',
                        customId: 'answer',
                        style: 'DANGER',
                        label: '查看此題解答',
                        disabled: !foundSoup.publicAnswer && foundSoup.authorId !== oldBtn.user.id,
                    },
                    {
                        type: 'BUTTON',
                        customId: 'hall',
                        style: 'SECONDARY',
                        label: '回到大門',
                    },
                    {
                        type: 'BUTTON',
                        customId: 'back',
                        style: 'SECONDARY',
                        label: '回上頁',
                    },
                ],
            }, {
                type: 'ACTION_ROW',
                components: [
                    {
                        type: 'BUTTON',
                        customId: 'mod_questions',
                        style: 'SUCCESS',
                        label: '查看你的提問',
                    },
                    {
                        type: 'BUTTON',
                        customId: 'questions',
                        style: 'SECONDARY',
                        label: '查看所有提問',
                    },
                ],
            }, {
                type: 'ACTION_ROW',
                components: [
                    {
                        type: 'BUTTON',
                        customId: 'edit',
                        style: 'PRIMARY',
                        label: '給這碗湯加料',
                        disabled: foundSoup.authorId !== oldBtn.user.id,
                    },
                    {
                        type: 'BUTTON',
                        customId: 'delete',
                        style: 'DANGER',
                        label: '倒掉這碗湯',
                        disabled: foundSoup.authorId !== oldBtn.user.id,
                    },
                ],
            }],
        });
    }
    const receivedBtn = await msg.awaitMessageComponent({
        filter(btn) {
            if (btn.user.id !== oldBtn.user.id) {
                btn.reply({ content: '你不可使用此按鈕', ephemeral: true });
                return false;
            }
            if (btn.customId === 'answer') {
                btn.reply({
                    embeds: [{
                        title: '解答',
                        description: answer,
                    }],
                    ephemeral: true,
                });
                return false;
            }
            return true;
        },
        time: 120_000,
    }).catch(() => {
        msg.edit({
            components: msg.components.map((row) => {
                row.components = row.components.map((component) => {
                    component.disabled = true;
                    return component;
                });
                return row;
            }),
        });
    });

    if (!receivedBtn) return;
    switch (receivedBtn.customId) {
        case 'questions': {
            return await Promise.resolve().then(() => allAns(receivedBtn, id, title, from, fromPage));
        }

        case 'mod_questions': {
            return await Promise.resolve().then(() => modAns(receivedBtn, id, title, from, fromPage));
        }

        case 'hall': {
            return await Promise.resolve(receivedBtn).then(hall);
        }

        case 'back': {
            if (from === 'all') return await Promise.resolve().then(() => all(receivedBtn, fromPage));
            if (from === 'mod') return await Promise.resolve().then(() => mod(receivedBtn, fromPage));
        }

        // eslint-disable-next-line no-fallthrough
        case 'edit': {
            return await Promise.resolve().then(() => edit(receivedBtn, id, from, fromPage));
        }

        case 'delete': {
            return await Promise.resolve().then(() => del(receivedBtn, id, from, fromPage));
        }
    }
};
