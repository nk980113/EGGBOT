require('./refresh')(); // Refresh slash commands 重新整理斜線指令

const { Client, Intents } = require('discord.js');
const fs = require('fs');
const { token } = require('./token.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const events = fs.readdirSync('./events');
// Event handling 事件處理
for (const file of events) {
    if (!file.endsWith('.js')) continue;
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.do(...args));
        console.log(`main:added once listener to event "${event.name}"`);
    } else {
        client.on(event.name, (...args) => event.do(...args));
        console.log(`main:added listener to event "${event.name}"`);
    }
}
client.login(token); // Login Discord 登入 Discord