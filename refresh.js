const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('./token.json');
const { clientId, guildId } = require('./config.json');
const fs = require('fs');
const r = new REST({version: '9'}).setToken(token);
const refresh = () => {
    const cmds = [];
    const testCmds = [];
    const cmdDirs = fs.readdirSync('./events/commands');
    for (const dir of cmdDirs) {
        const cmdFiles = fs.readdirSync(`./events/commands/${dir}`).filter(f => f.endsWith('.js'));
        for (const file of cmdFiles) {
            const cmd = require(`./events/commands/${dir}/${file}`);
            if (cmd.test) {
                testCmds.push(cmd.data.toJSON());
                console.log(`refresh:Pushed testing command ${file.replace('.js', '')}`);
            } else {
                cmds.push(cmd.data.toJSON());
                console.log(`refresh:Pushed command ${file.replace('.js', '')}`);
            }
        }
    }
    (async () => {
        try {
            await r.put(
                Routes.applicationCommands(clientId),
                { body: cmds }
            );
            console.log('refresh:Global /commands refreshed.');
        } catch(err) {
            console.error(err);
        }
        try {
            await r.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: testCmds }
            );
            console.log('refresh:Testing /commands refreshed.');
        } catch(err) {
            console.error(err);
        }
    })();
    
}
module.exports = refresh;