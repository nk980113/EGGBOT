const { readdirSync } = require('fs');
const { join } = require('path');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { guildId } = require('../../setup/config.json');
const sleep = require('util').promisify(setTimeout);
module.exports = {
    bi: {
        data: new SlashCommandBuilder().setName('bi').setDescription('查看機器人的資訊'),
        async do(cmd) {
            const package = require('../../package.json');
            await cmd.deferReply();
            await sleep(500);
            //                                                                                官網: https://sites.google.com/view/eggbotsblogger
            await cmd.editReply('`版本`:`β ' + package.version + '`\n`創造者`:eggeggegg#1278\n`官網`: 建造中 \n`使用套件版本`:discord.js v' + package.dependencies['discord.js'].replace('^', '') + '\n`官方伺服器`: || https://discord.gg/26R8MPze2J ||');
        },
    },
    cmds: {
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