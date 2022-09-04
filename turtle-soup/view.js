const { soup } = require('../DB/soup');
const resolveImport = require('./resolveImport');
const hall = resolveImport('./hall');
const all = resolveImport('./all');
const mod = resolveImport('./mod');

/**
 * @param {import('discord.js').ButtonInteraction} oldBtn
 * @param {number} id
 * @param {string} from
 * @param {number} fromPage
 */
module.exports = async function view(oldBtn, id, from, fromPage) {
    const foundSoup = soup.entries.find((s) => s.soupId === id);
    const author = await oldBtn.client.users.fetch(foundSoup.authorId);
    /** @type {import('discord.js').Message} */
    const msg = await oldBtn.update({
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
                    label: '編輯此題',
                    disabled: true,
                },
            ],
        }],
    });
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
                        description: foundSoup.answer,
                    }],
                    ephemeral: true,
                });
                return false;
            }
            return true;
        },
        time: 120_000,
    }).catch(() => {
        msg.edit({ components: [{ type: 'ACTION_ROW', components: msg.components[0].components.map((btn) => {
            btn.disabled = true;
            return btn;
        }) }] });
    });

    if (!receivedBtn) return;
    switch (receivedBtn.customId) {
        case 'hall': {
            return await hall(receivedBtn);
        }

        case 'back': {
            if (from === 'all') return await all(receivedBtn, fromPage);
            if (from === 'mod') return await mod(receivedBtn, fromPage);
        }
    }
};