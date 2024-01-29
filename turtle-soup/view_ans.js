const request = require('../request');
const resolveImport = require('./resolveImport');
const modAns = resolveImport('./mod_ans');
const allAns = resolveImport('./all_ans');
const view = resolveImport('./view');

/**
 * @param {import('discord.js').ButtonInteraction} oldBtn
 * @param {number} soupId
 * @param {number} answerId
 * @param {string} from
 * @param {number} fromPage
 * @param {string} ansFrom
 * @param {number} ansFromPage
 * @param {string} title
 */
module.exports = async function viewAns(oldBtn, soupId, answerId, from, fromPage, ansFrom, ansFromPage, title) {
    const ansData = await request({ resource: 'soup', method: 'findansbyid', metadata: { soupId, answerId } });
    /** @type {import('discord.js').Message} */
    let msg;

    if (!ansData.success) {
        setImmediate(() => {
            throw ansData.error;
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
                        customId: 'soup',
                        style: 'SECONDARY',
                        label: '回到原題目',
                    },
                ],
            }],
            fetchReply: true,
        });
    } else {
        const foundAns = ansData.metadata;
        const author = await oldBtn.client.users.fetch(foundAns.by);
        msg = await oldBtn.update({
            fetchReply: true,
            embeds: [{
                color: 'AQUA',
                title: `#${soupId}`,
                footer: {
                    text: `由${author.displayName}提問`,
                    iconURL: author.displayAvatarURL({ dynamic: true }),
                },
                description: foundAns.content,
                timestamp: foundAns.timestamp,
            }],
            components: [{
                type: 'ACTION_ROW',
                components: [
                    {
                        type: 'BUTTON',
                        customId: 'back',
                        style: 'SECONDARY',
                        label: '回上頁',
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
        case 'soup': {
            return await Promise.resolve().then(() => view(receivedBtn, soupId, from, fromPage));
        }

        case 'back': {
            if (ansFrom === 'all') return await Promise.resolve().then(() => allAns(receivedBtn, soupId, title, from, fromPage, ansFromPage));
            if (ansFrom === 'mod') return await Promise.resolve().then(() => modAns(receivedBtn, soupId, title, from, fromPage, ansFromPage));
        }
    }
};
