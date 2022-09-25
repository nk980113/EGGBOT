const { soup } = require('../DB/soup');
const resolveImport = require('./resolveImport');
const hall = resolveImport('./hall');
const view = resolveImport('./view');

/**
 * @param {import('discord.js').ButtonInteraction} btn
 * @param {number} [page]
 */
module.exports = async function all(btn, page = 0) {
    const limitedSoups = soup.entries.slice().reverse().filter((_, i) => page * 25 <= i && i < (page + 1) * 25);
    /** @type {import('discord.js').Message} */
    const msg = await btn.update({
        embeds: [{
            color: 'AQUA',
            title: '已發布的海龜湯',
            fields: limitedSoups.map((s) => ({
                name: `#${s.soupId} ${s.title}`,
                value: s.content.length <= 20
                    ? s.content
                    : `${s.content.slice(0, 19).replace('\n', ' ')}...`,
                inline: true,
            })),
            footer: {
                text: `共${Math.ceil(soup.entries.length / 25)}頁，這是第${page + 1}頁`,
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
                        disabled: soup.entries.length > page * 25,
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
        return await view(
            receivedComponent,
            Number(receivedComponent.values[0]),
            'all',
            page,
        );
    } else {
        switch (receivedComponent.customId) {
            case 'hall': {
                return await hall(receivedComponent);
            }

            case 'lastpage': {
                return await all(receivedComponent, --page);
            }

            case 'nextpage': {
                return await all(receivedComponent, ++page);
            }
        }
    }
};