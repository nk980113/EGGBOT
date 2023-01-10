const { readdirSync } = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { guildId, ownerId } = require('../../setup/config.json');
module.exports = {
    name: '資訊',
    description: '關於機器人各種資訊的指令',
    botinfo: {
        data: new SlashCommandBuilder().setDescription('查看機器人的資訊'),
        async do(cmd) {
            const package = require('../../package.json');
            const inline = true;
            const githubLinkText = '打我啊笨蛋，只有一個字藏有正確連結，ㄏㄏㄏㄏㄏㄏㄏㄏㄏ';
            const githubEmbedLinks = Array(githubLinkText.length).fill('https://youtu.be/dQw4w9WgXcQ');
            githubEmbedLinks[Math.floor(Math.random() * githubLinkText.length)] = 'https://github.com/nk980113/EGGBOT';
            const githubLink = githubEmbedLinks.map((l, i) => `[${githubLinkText[i]}](${l})`).join('');
            cmd.reply({
                embeds: [{
                    fields: [
                        {
                            name: '版本',
                            value: package.version,
                            inline,
                        },
                        {
                            name: 'node.js版本',
                            value: process.versions.node,
                            inline,
                        },
                        {
                            name: 'discord.js版本',
                            value: package.dependencies['discord.js'].replace('^', ''),
                            inline,
                        },
                        {
                            name: '開發者',
                            value: '<@585697975003774979>(eggeggegg#1278)',
                            inline,
                        },
                        {
                            name: '機器人開發伺服器',
                            value: '||https://discord.gg/26R8MPze2J||',
                            inline,
                        },
                        {
                            name: 'GitHub連結',
                            value: `||${githubLink}||`,
                        },
                        {
                            name: '說明',
                            value: '這台機器人的功能，\n基本上全部都是經過完整測試才釋出的。\n機器人不求多元，只求創新。\n功能不求多，只求好。\n如果有新功能要建議，\n請盡量使用/suggest指令，\n我們將盡快處理。',
                        },
                        {
                            name: '冷知識',
                            value: '||這台機器人永遠都是beta版，||||因為功能的推陳出新絕對不會有結束的一天||',
                        },
                    ],
                    color: 0x35393f,
                }],
            });
        },
    },
    commands: {
        data: new SlashCommandBuilder().setDescription('查看所有類別/指令')
            .addStringOption(op => op
                .setName('category')
                .setDescription('要查詢的類別代號(若無則顯示所有類別)，類別代號及其意義包含在所有類別的頁面中')
                .setRequired(false)
                .addChoices(...readdirSync(__dirname).filter(f => f.endsWith('.js')).map((i) => ({ name: i.replace('.js', ''), value: i.replace('.js', '') })))),
        /** @param {import('discord.js').CommandInteraction} cmd */
        do(cmd) {
            const catName = cmd.options.getString('category');
            if (!catName) {
                const embed = {
                    title: '所有指令類別',
                    description: '冒號前為類別代號，冒號後為名稱',
                    color: 'RANDOM',
                    fields: [],
                };
                const cmdFiles = readdirSync(__dirname).filter(f => f.endsWith('.js'));
                for (const file of cmdFiles) {
                    const rawCat = require(`./${file}`);
                    const cmds = Object.keys(rawCat).filter((k) => !['name', 'description'].includes(k));
                    const availableCmds = cmd.guildId === guildId ? cmds.filter((k) => !rawCat[k].off && (!rawCat[k].ownerOnly || cmd.user.id === ownerId)) : cmds.filter((k) => !rawCat[k].off && !rawCat[k].test && (!rawCat[k].ownerOnly || cmd.user.id === ownerId));
                    embed.fields.push({
                        name: `${file.replace('.js', '')}：${rawCat.name}`,
                        value: `${rawCat.description}\n在${cmd.guild ? '此伺服器' : '私訊'}中共${availableCmds.length}條可用指令`,
                    });
                }
                cmd.reply({ embeds: [embed] });
            } else {
                const rawCat = require(`./${catName}`);
                const cmds = Object.keys(rawCat).filter((k) => !['name', 'description'].includes(k));
                const availableCmds = cmd.guildId === guildId ? cmds.filter((k) => !rawCat[k].off && (!rawCat[k].ownerOnly || cmd.user.id === ownerId)) : cmds.filter((k) => !rawCat[k].off && !rawCat[k].test && (!rawCat[k].ownerOnly || cmd.user.id === ownerId));
                const embed = {
                    title: `${rawCat.name}類別(${catName})`,
                    description: `${rawCat.description}\n在${cmd.guild ? '此伺服器' : '私訊'}中共${availableCmds.length}條可用指令`,
                    color: 'RANDOM',
                    fields: [],
                };
                for (const slashCmd of availableCmds) {
                    embed.fields.push({
                        name: `/${slashCmd}`,
                        value: rawCat[slashCmd].data.description,
                    });
                }
                cmd.reply({ embeds: [embed] });
            }
        },
    },
};
