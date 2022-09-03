const { soup } = require('../DB/soup');
const resolveImport = require('./resolveImport');
const hall = resolveImport('./hall');
const create = resolveImport('./create');

/**
 * @param {import('discord.js').ButtonInteraction} oldBtn
 * @param {number} [page]
 */
async function mod(oldBtn, page = 0) {
    const { user } = oldBtn;
    const soups = soup.entries.filter((s) => s.authorId === user.id);
    /** @type {import('discord.js').Message} */
    let msg;
    if (!soups.length) {
        msg = await oldBtn.update({
            embeds: [{
                color: 'GREYPLE',
                title: '你煮過的湯',
                fields: [{
                    name: '這裡空空如也',
                    value: '看來你是個菜鳥廚師～',
                }],
            }],
            components: [{ type: 'ACTION_ROW', components: [
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
            ] }],
            fetchReply: true,
        });
    } else {
        const limitedSoups = soups.filter((_, i) => page * 25 <= i && i < (page + 1) * 25);
        msg = await oldBtn.update({
            embeds: [{
                color: 'GREYPLE',
                title: '你煮過的湯',
                fields: limitedSoups.map((s) => ({
                    name: `#${s.soupId} ${s.title}`,
                    value: `${s.content.slice(0, 19)}...`,
                    inline: true,
                })),
                footer: {
                    text: `共${Math.ceil(limitedSoups.length / 25)}頁，這是第${page + 1}頁`,
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
                        disabled: true,
                        options: limitedSoups.map((s) => ({
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
                            disabled: limitedSoups.length > page * 25,
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
    const receivedComponent = await msg.awaitMessageComponent({
        filter(component) {
            if (component.user.id !== oldBtn.user.id) {
                oldBtn.reply({ content: '你不可使用此按鈕', ephemeral: true });
                return false;
            }
            return true;
        },
        time: 120_000,
    }).catch(() => {
        msg.edit({ components: msg.components.map((row) => {
            row.components = row.components.map((component) => {
                component.disabled = true;
                return component;
            });
            return row;
        }) });
    });
    if (!receivedComponent) return;
    if (receivedComponent.isSelectMenu()) {
        // TODO: implement this
    } else {
        switch (receivedComponent.customId) {
            case 'hall': {
                return await hall(receivedComponent);
            }

            case 'lastpage': {
                return await mod(receivedComponent, --page);
            }

            case 'nextpage': {
                return await mod(receivedComponent, ++page);
            }

            case 'create': {
                return await create(receivedComponent);
            }
        }
    }
}
module.exports = mod;