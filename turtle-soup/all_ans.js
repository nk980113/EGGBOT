const request = require('../request');
const resolveImport = require('./resolveImport');
const viewAns = resolveImport('./view_ans');
const view = resolveImport('./view');

/**
 * @param {import('discord.js').ButtonInteraction} btn
 * @param {number} soupId
 * @param {string} title
 * @param {string} from
 * @param {number} fromPage
 * @param {number} [page]
 */
module.exports = async function allAns(btn, soupId, title, from, fromPage, page = 0) {
    await btn.deferUpdate();
    const data = await request({ resource: 'soup', method: 'findallans', metadata: { soupId, page } });
    /** @type {import('discord.js').Message} */
    let msg;
    if (!data.success) {
        setImmediate(() => {
            throw data.error;
        });
        msg = await btn.editReply({
            embeds: [{
                color: 'RED',
                title: '所有提問',
                fields: [{
                    name: '找尋提問時發生錯誤',
                    value: '已回報至開發伺服器',
                }],
            }],
            components: [{
                type: 'ACTION_ROW', components: [
                    {
                        type: 'BUTTON',
                        style: 'PRIMARY',
                        label: '回到原題目',
                        customId: 'back',
                    },
                    {
                        type: 'BUTTON',
                        style: 'SECONDARY',
                        label: '回到大門',
                        customId: 'hall',
                    },
                ],
            }],
            fetchReply: true,
        });
    } else {
        /** @type {{ answerId: number; by: string; shortContent: string; shortReply: string; }[]} */
        const anss = data.metadata.anss;
        const users = await Promise.all(anss.map((a) => btn.client.users.fetch(a.by).then((u) => u.displayName)));
        if (anss.length > 0) {
            msg = await btn.editReply({
                embeds: [{
                    color: 'GREEN',
                    title: `${title} 的所有提問`,
                    fields: anss.map((a, i) => ({
                        name: `#${a.answerId} by ${users[i]} ${a.shortReply}`,
                        value: a.shortContent,
                    })),
                    footer: {
                        text: `共${data.metadata.totalPages}頁，這是第${page + 1}頁`,
                    },
                }],
                components: [
                    {
                        type: 'ACTION_ROW',
                        components: [{
                            type: 'SELECT_MENU',
                            customId: 'viewans',
                            placeholder: '選一個提問來看',
                            minValues: 1,
                            maxValues: 1,
                            options: anss.map((a, i) => ({
                                value: String(soupId),
                                label: `#${a.answerId} by ${users[i]}`,
                            })),
                        }],
                    },
                    {
                        type: 'ACTION_ROW',
                        components: [
                            {
                                type: 'BUTTON',
                                customId: 'lastpage',
                                style: 'PRIMARY',
                                emoji: '◀',
                                label: '上一頁',
                                disabled: page === 0,
                            },
                            {
                                type: 'BUTTON',
                                customId: 'nextpage',
                                style: 'PRIMARY',
                                emoji: '▶',
                                label: '下一頁',
                                disabled: data.metadata.totalPages <= page + 1,
                            },
                            {
                                type: 'BUTTON',
                                style: 'SECONDARY',
                                label: '回到原題目',
                                customId: 'back',
                            },
                        ],
                    },
                ],
                fetchReply: true,
            });
        } else if (page > 0) {
            msg = await btn.editReply({
                embeds: [{
                    color: 'BLURPLE',
                    title: '',
                    fields: [{
                        name: 'eRroR pAgE OveRfLo',
                        value: 'w',
                    }],
                    footer: {
                        text: '共0頁，這是第0頁',
                    },
                }],
                components: [
                    {
                        type: 'ACTION_ROW',
                        components: [
                            {
                                type: 'BUTTON',
                                customId: 'lastpage',
                                style: 'PRIMARY',
                                emoji: '◀',
                                label: '上一頁',
                                disabled: true,
                            },
                            {
                                type: 'BUTTON',
                                customId: 'nextpage',
                                style: 'PRIMARY',
                                emoji: '▶',
                                label: '下一頁',
                                disabled: true,
                            },
                            {
                                type: 'BUTTON',
                                style: 'SECONDARY',
                                label: '回到原題目',
                                customId: 'back',
                            },
                        ],
                    },
                ],
                fetchReply: true,
            });
        } else {
            msg = await btn.editReply({
                embeds: [{
                    color: 'BLURPLE',
                    title: '所有提問',
                    fields: [{
                        name: '這裡空空如也',
                        value: '徵人啟事：徵求一名玩家問個問題，叫醒~~||郭台銘||~~出題者',
                    }],
                    footer: {
                        text: '共0頁，這是第0頁',
                    },
                }],
                components: [
                    {
                        type: 'ACTION_ROW',
                        components: [
                            {
                                type: 'BUTTON',
                                customId: 'lastpage',
                                style: 'PRIMARY',
                                emoji: '◀',
                                label: '上一頁',
                                disabled: true,
                            },
                            {
                                type: 'BUTTON',
                                customId: 'nextpage',
                                style: 'PRIMARY',
                                emoji: '▶',
                                label: '下一頁',
                                disabled: true,
                            },
                            {
                                type: 'BUTTON',
                                style: 'SECONDARY',
                                label: '回到原題目',
                                customId: 'back',
                            },
                        ],
                    },
                ],
                fetchReply: true,
            });
        }
        const receivedComponent = await msg.awaitMessageComponent({
            filter(component) {
                if (component.user.id !== btn.user.id) {
                    component.reply({ content: '你不可使用此按鈕', ephemeral: true });
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
        if (!receivedComponent) return;
        if (receivedComponent.isSelectMenu()) {
            return await viewAns(
                receivedComponent,
                soupId,
                Number(receivedComponent.values[0]),
                from,
                fromPage,
                'all',
                page,
                title,
            );
        } else {
            switch (receivedComponent.customId) {
                case 'back': {
                    return Promise.resolve().then(() => view(receivedComponent, soupId, from, fromPage));
                }

                case 'lastpage': {
                    return await allAns(receivedComponent, soupId, title, from, fromPage, --page);
                }

                case 'nextpage': {
                    return await allAns(receivedComponent, soupId, title, from, fromPage, ++page);
                }
            }
        }
    }
};
