const { DiscordTogether } = require('discord-together');
const sleep = require('util').promisify(setTimeout);
const together = async menu => {
    menu.message.delete();
    if (menu.values.includes('leave')) {
        const msg = await menu.message.channel.send('881');
        await sleep(1000);
        return msg.delete();
    }
    const { member: { voice: { channelId: id } }, values: { [0]: c } } = menu;
    if ((typeof id === 'object') || (typeof id === 'undefined')) {
        const msg = await menu.message.channel.send('給我悔過，重新使用指令！連讓我發揮的機會都沒有...');
        await sleep(1000);
        return msg.delete();
    }
    const dcTogether = new DiscordTogether(menu.client);
    const { code } = await dcTogether.createTogetherCode(id, c);
    menu.message.channel.send(code);
    return;
};
module.exports = together;