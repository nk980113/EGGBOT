const request = require('../request');
const resolveImport = require('./resolveImport');
const hall = resolveImport('./hall');
const create = resolveImport('./create');
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
async function modAns(btn, soupId, title, from, fromPage, page = 0) {
    await btn.deferUpdate();
    const { user } = btn;
    const data = await request({ resource: 'soup', method: 'findallansbyauthor', metadata: { authorId: user.id, page, soupId } });
    /** @type {import('discord.js').Message} */
    let msg;
    if (!data.success) {
        setImmediate(() => {
            throw data.error;
        });
        msg = await btn.editReply({
            embeds: [{
                color: 'RED',
                title: `你對${title}的所有提問`,
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
                        label: '提問',
                        customId: 'create',
                        disabled: true,
                    },
                    {
                        type: 'BUTTON',
                        customId: 'soup',
                        style: 'SECONDARY',
                        label: '回到原題目',
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
        if (!anss.length) {
            if (page === 0) {
                msg = await btn.editReply({
                    embeds: [{
                        color: 'GREYPLE',
                        title: `你對${title}的所有提問`,
                        fields: [{
                            name: '這裡空空如也',
                            value: '看來你是個菜鳥評論家～',
                        }],
                    }],
                    components: [{
                        type: 'ACTION_ROW', components: [
                            {
                                type: 'BUTTON',
                                style: 'PRIMARY',
                                label: '提問',
                                customId: 'create',
                                disabled: true,
                            },
                            {
                                type: 'BUTTON',
                                customId: 'back',
                                style: 'SECONDARY',
                                label: '回到原題目',
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
                msg = await btn.editReply({
                    embeds: [{
                        color: 'GREYPLE',
                        title: `你對${title}的所有提問`,
                        fields: [{
                            name: '問題很多欸',
                            value: `你問了${data.metadata.totalPages}頁的問題，但我們現在在第${page + 1}頁？`,
                        }],
                    }],
                    components: [{
                        type: 'ACTION_ROW', components: [
                            {
                                type: 'BUTTON',
                                style: 'PRIMARY',
                                label: '提問',
                                customId: 'create',
                                disabled: true,
                            },
                            {
                                type: 'BUTTON',
                                customId: 'back',
                                style: 'SECONDARY',
                                label: '回到原題目',
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
            }
        } else {
            const users = await Promise.all(anss.map((a) => btn.client.users.fetch(a.by).then((u) => u.displayName)));
            msg = await btn.editReply({
                embeds: [{
                    color: 'GREYPLE',
                    title: `你對${title}的所有提問`,
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
                                disabled: data.metadata.totalPages <= page,
                            },
                            {
                                type: 'BUTTON',
                                style: 'PRIMARY',
                                label: '提問',
                                customId: 'create',
                                disabled: true,
                            },
                            {
                                type: 'BUTTON',
                                style: 'SECONDARY',
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
                    },
                ],
                fetchReply: true,
            });
        }
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
            'mod',
            page,
            title,
        );
    } else {
        switch (receivedComponent.customId) {
            case 'hall': {
                return await Promise.resolve(receivedComponent).then(hall);
            }

            case 'lastpage': {
                return await Promise.resolve().then(() => modAns(receivedComponent, --page));
            }

            case 'nextpage': {
                return await Promise.resolve().then(() => modAns(receivedComponent, ++page));
            }

            case 'create': {
                return await Promise.resolve(receivedComponent).then(create);
            }

            case 'back': {
                return Promise.resolve().then(() => view(receivedComponent, soupId, from, fromPage));
            }
        }
    }
}
module.exports = modAns;
