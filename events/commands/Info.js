const { readdirSync } = require('fs');
const { join } = require('path');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { guildId } = require('../../setup/config.json');
module.exports = {
    botinfo: {
        data: new SlashCommandBuilder().setDescription('查看機器人的資訊'),
        async do(cmd) {
            const package = require('../../package.json');
            cmd.reply({
                embeds: [
                    new MessageEmbed()
                        .addFields([
                            {
                                name: '版本',
                                value: package.version,
                                inline: true,
                            },
                            {
                                name: '開發者',
                                value: 'eggeggegg#1278',
                                inline: true,
                            },
                            {
                                name: 'discord.js版本',
                                value: package.dependencies['discord.js'].replace('^', ''),
                                inline: true,
                            },
                            {
                                name: '機器人開發伺服器',
                                value: '||discord.gg/26R8MPze2J||',
                            },
                            {
                                name: '說明',
                                value: '這台機器人的功能，\n基本上全部都是經過完整測試才釋出的，\n如果有新功能要建議，\n請盡量使用/suggest指令，\n我們將盡快處理。',
                            },
                            {
                                name: '冷知識',
                                value: '||這台機器人永遠都是beta版，因為功能絕不會有做完的一天||',
                            },
                        ]).setColor([0x35, 0x39, 0x3f]),
                ],
            });
        },
    },
    commands: {
        data: new SlashCommandBuilder().setDescription('查看所有指令'),
        do(cmd) {
            let cmdsStr = '';
            const cmdFiles = readdirSync(__dirname).filter(f => f.endsWith('.js'));
            for (const file of cmdFiles) {
                cmdsStr += `\`\`\`${file.replace('.js', '')}\`\`\`\n`;
                delete require.cache[join(__dirname, file)];
                const importedCmds = require(`./${file}`);
                for (const cmdName in importedCmds) {
                    const importedCmd = importedCmds[cmdName];
                    if (importedCmd.off) continue;
                    if (!importedCmd.test || cmd.guildId == guildId) cmdsStr += `\`${cmdName}\` `;
                }
                cmdsStr += '\n';
            }
            cmd.reply(cmdsStr);
        },
    },
};