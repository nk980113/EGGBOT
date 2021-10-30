const { joinVoiceChannel } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');
const ytdl = require('ytdl-core');
module.exports = {
    data: new SlashCommandBuilder().setName('play').setDescription('播放音樂').addStringOption(op => op.setName('YT網址').setDescription('你要播放的音樂網址').setRequired(true)),
    test: true,
    off: true,
    async do(cmd) {
        if (!cmd.member.voice.channel) {
            cmd.reply('你沒加入語音頻道，還叫我加入？');
            return;
        } 
        const connection = joinVoiceChannel({
            channelId: cmd.member.voice.channel.id,
            guildId: cmd.guild.id,
            adapterCreator: cmd.guild.voiceAdapterCreator
        });
        const ytUrl = cmd.getString('YT網址');
        if (/^https:\/\/www\.youtube.com\/$/.test(ytUrl) || / /.test(ytUrl)) {

        }
    }
}