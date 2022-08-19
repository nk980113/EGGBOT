const logger = require('../logger');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('./token.json');
const { clientId, guildId } = require('./config.json');
const { readdirSync } = require('fs');
const { join } = require('path');
const r = new REST({ version: '10' }).setToken(token);
const refresh = () => {
    const cmds = [];
    const testCmds = [];
    const cmdFiles = readdirSync(join(__dirname, '..', 'events', 'commands')).filter(f => f.endsWith('.js'));
    for (const file of cmdFiles) {
        delete require.cache[join(__dirname, '..', 'events', 'commands', file)];
        const importedCmds = require(`../events/commands/${file}`);
        for (const cmdName in importedCmds) {
            const cmd = importedCmds[cmdName];
            if (cmd.off) continue;
            if (cmd.test) {
                testCmds.push(cmd.data.setName(cmdName).toJSON());
                logger.info(`refresh:Pushed testing command ${cmdName}`);
            } else {
                cmds.push(cmd.data.setName(cmdName).toJSON());
                logger.info(`refresh:Pushed command ${cmdName}`);
            }
        }
    }
    (async () => {
        try {
            await r.put(
                Routes.applicationCommands(clientId),
                { body: cmds },
            );
            logger.info('refresh:Global /commands refreshed.');
        } catch (err) {
            logger.error(err);
        }
        try {
            await r.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: testCmds },
            );
            logger.info('refresh:Testing /commands refreshed.');
        } catch (err) {
            logger.error(err);
        }
    })();
};
module.exports = refresh;