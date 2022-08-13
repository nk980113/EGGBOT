const { readdirSync } = require('fs');
const { join } = require('path');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { guildId } = require('../../setup/config.json');
module.exports = {
    botinfo: {
        data: new SlashCommandBuilder().setName('bi').setDescription('查看機器人的資訊'),
        async do(cmd) {
            const package = require('../../package.json');
            cmd.reply('`版本`:`β ' + package.version + '`\n`創造者`:eggeggegg#1278\n`使用套件版本`:discord.js v' + package.dependencies['discord.js'].replace('^', '') + '\n`官方伺服器`: || https://discord.gg/26R8MPze2J ||\n`說明`：\n這台機器人的功能，\n基本上全部都是經過完整測試才釋出的，\n如果有新功能要建議，\n請盡量使用`/suggest`指令，\n我們將盡快處理。\n||冷知識：這台機器人永遠都是beta版，因為功能絕不會有做完的一天||');
        },
    },
    commands: {
        data: new SlashCommandBuilder().setName('cmds').setDescription('查看所有指令'),
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