const { DiscordTogether } = require('discord-together');
const together = menu => {
    if (menu.values.includes('leave')) return menu.message.edit('881');
    if (!menu.member.voice.channel) menu.message.edit('給我加進語音頻道...唉...你得重新使用指令了...');
    const dcTogether = new DiscordTogether(menu.client);
    dcTogether.createTogetherCode(menu.member.voice.channel.id, menu.values[0]).then(async ({ code }) => menu.message.channel.send(code));
};
module.exports = together;