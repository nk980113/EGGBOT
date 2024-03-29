const request = require('../request');
const resolveImport = require('./resolveImport');
const hall = resolveImport('./hall');
const create = resolveImport('./create');
const view = resolveImport('./view');

/**
 * @param {import('discord.js').ButtonInteraction} btn
 * @param {number} [page]
 */
async function mod(btn, page = 0) {
    await btn.deferUpdate();
    const { user } = btn;
    const data = await request({ resource: 'soup', method: 'findallbyauthor', metadata: { authorId: user.id, page } });
    /** @type {import('discord.js').Message} */
    let msg;
    if (!data.success) {
        setImmediate(() => {
            throw data.error;
        });
        msg = await btn.editReply({
            embeds: [{
                color: 'RED',
                title: '你煮過的湯',
                fields: [{
                    name: '找尋煮過的湯時發生錯誤',
                    value: '已回報至開發伺服器',
                }],
            }],
            components: [{
                type: 'ACTION_ROW', components: [
                    {
                        type: 'BUTTON',
                        style: 'PRIMARY',
                        label: '煮一碗湯',
                        customId: 'create',
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
        /** @type {{ soupId: number; title: string; shortContent: string; }[]} */
        const soups = data.metadata.soups;
        if (!soups.length) {
            if (page === 0) {
                msg = await btn.editReply({
                    embeds: [{
                        color: 'GREYPLE',
                        title: '你煮過的湯',
                        fields: [{
                            name: '這裡空空如也',
                            value: '看來你是個菜鳥廚師～',
                        }],
                    }],
                    components: [{
                        type: 'ACTION_ROW', components: [
                            {
                                type: 'BUTTON',
                                style: 'PRIMARY',
                                label: '煮一碗湯',
                                customId: 'create',
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
                        title: '你煮過的湯',
                        fields: [{
                            name: `逼...噗...第${page + 1}頁不存在`,
                            value: '回第一頁看看吧，但我好像沒放回第一頁的按鈕？',
                        }],
                    }],
                    components: [{
                        type: 'ACTION_ROW', components: [
                            {
                                type: 'BUTTON',
                                style: 'PRIMARY',
                                label: '煮一碗湯',
                                customId: 'create',
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
            msg = await btn.editReply({
                embeds: [{
                    color: 'GREYPLE',
                    title: '你煮過的湯',
                    fields: soups.map((s) => ({
                        name: `#${s.soupId} ${s.title}`,
                        value: s.shortContent,
                        inline: true,
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
                            customId: 'view',
                            placeholder: '選一碗湯來看',
                            minValues: 1,
                            maxValues: 1,
                            options: soups.map((s) => ({
                                value: String(s.soupId),
                                label: s.title,
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
                                label: '煮一碗湯',
                                customId: 'create',
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
        return await Promise.resolve().then(() => view(
            receivedComponent,
            Number(receivedComponent.values[0]),
            'mod',
            page,
        ));
    } else {
        switch (receivedComponent.customId) {
            case 'hall': {
                return await Promise.resolve(receivedComponent).then(hall);
            }

            case 'lastpage': {
                return await Promise.resolve().then(() => mod(receivedComponent, --page));
            }

            case 'nextpage': {
                return await Promise.resolve().then(() => mod(receivedComponent, ++page));
            }

            case 'create': {
                return await Promise.resolve(receivedComponent).then(create);
            }
        }
    }
}
module.exports = mod;
