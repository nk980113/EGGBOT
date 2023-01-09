const request = require('../request');
const resolveImport = require('./resolveImport');
const hall = resolveImport('./hall');
const all = resolveImport('./all');
const mod = resolveImport('./mod');
const edit = resolveImport('./edit');

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
        const author = await oldBtn.client.users.fetch(foundSoup.authorId);
        msg = await oldBtn.update({
            fetchReply: true,
            embeds: [{
                color: 'NAVY',
                title: `#${foundSoup.soupId} ${foundSoup.title}`,
                footer: {
                    text: `由${author.tag}出題`,
                    iconURL: author.displayAvatarURL({ dynamic: true }),
                },
                description: foundSoup.content,
            }],
            components: [{
                type: 'ACTION_ROW',
                components: [
                    {
                        type: 'BUTTON',
                        customId: 'questions',
                        style: 'SUCCESS',
                        label: '查看所有問題',
                        disabled: true,
                    },
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
                    {
                        type: 'BUTTON',
                        customId: 'edit',
                        style: 'PRIMARY',
                        label: '給這碗湯加料',
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
            components: [{
                type: 'ACTION_ROW', components: msg.components[0].components.map((btn) => {
                    btn.disabled = true;
                    return btn;
                }),
            }],
        });
    });

    if (!receivedBtn) return;
    switch (receivedBtn.customId) {
        case 'hall': {
            return await Promise.resolve(receivedBtn).then(hall);
        }

        case 'back': {
            if (from === 'all') return await Promise.resolve().then(() => all(receivedBtn, fromPage));
            if (from === 'mod') return await Promise.resolve().then(() => mod(receivedBtn, fromPage));
        }

        // eslint-disable-next-line no-fallthrough
        case 'edit': {
            return await edit(receivedBtn, id, from, fromPage);
        }
    }
};
