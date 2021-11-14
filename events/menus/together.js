const { DiscordTogether } = require('discord-together');
const together = menu => {
    menu.message.delete();
    if (menu.values.includes('leave')) return menu.message.channel.send('881').then(s => setTimeout(s.delete, 1000));
    const { member: { voice: { channelId: id } }, values: { [0]: c } } = menu;
    if ((typeof id === 'object') || (typeof id === 'undefined')) return menu.message.channel.send('給我悔過，重新使用指令！連讓我發揮的機會都沒有...').then(s => setTimeout(s.delete, 1000));
    const dcTogether = new DiscordTogether(menu.client);
    dcTogether.createTogetherCode(id, c).then(async ({ code }) => menu.message.channel.send(code));
    return;
};
module.exports = together;