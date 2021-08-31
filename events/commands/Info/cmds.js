const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { guildId } = require('../../../config.json');
module.exports = {
    data: new SlashCommandBuilder().setName('cmds').setDescription('查看所有指令'),
    test: true,
    do(cmd) {
        let cmdsStr = '';
        const cmdDirs = fs.readdirSync('./events/commands');
        for (const dir of cmdDirs) {
            cmdsStr += `\`\`\`${dir}\`\`\`\n`;
            const cmdFiles = fs.readdirSync(`./events/commands/${dir}`).filter(f => f.endsWith('.js'));
            for (const file of cmdFiles) {
                const importedCmd = require(`../${dir}/${file}`);
                if (!importedCmd.test || cmd.guildId == guildId) {
                    cmdsStr += `\`${file}\` `.replace('.js', '');
                }
            }
            cmdsStr += '\n'
        }
        cmd.reply(cmdsStr);
    }
}