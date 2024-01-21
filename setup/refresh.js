const { readdirSync } = require('node:fs');
const { join } = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const logger = require('../logger');
const { token } = require('./token.json');
const { clientId, guildId } = require('./config.json');

const rest = new REST({ version: '10' }).setToken(token);
module.exports = function refresh() {
    const cmds = [];
    const testCmds = [];
    const cmdFiles = readdirSync(join(__dirname, '..', 'events', 'commands')).filter(f => f.endsWith('.js'));
    for (const file of cmdFiles) {
        delete require.cache[join(__dirname, '..', 'events', 'commands', file)];
        const importedCmds = require(`../events/commands/${file}`);
        for (const cmdName in importedCmds) {
            if (['name', 'description'].includes(cmdName)) continue;
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
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: cmds },
            );
            logger.info('refresh:Global /commands refreshed.', true);
        } catch (err) {
            logger.error(err);
        }
        try {
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: testCmds },
            );
            logger.info('refresh:Testing /commands refreshed.', true);
        } catch (err) {
            logger.error(err);
        }
    })();
};
