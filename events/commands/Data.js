const { SlashCommandBuilder } = require('@discordjs/builders');
const { join } = require('path');
const DB = require('../../DB');
module.exports = {
    save: {
        data: new SlashCommandBuilder()
            .setName('save')
            .setDescription('在資料庫中存值')
            .addStringOption(op => op
                .setName('value')
                .setDescription('要存入的值')
                .setRequired(true)),
        /**
         * @param {import('discord.js').CommandInteraction} cmd
         */
        do(cmd) {
            const dataDB = new DB(join(DB.dirPath, 'data.json'));
            const { data } = dataDB;
            let i = 0;
            while (i in data) i++;
            data[i] = {
                value: cmd.options.getString('value'),
                userId: cmd.user.id,
            };
            dataDB.write();
            cmd.reply({ content: `位址：${i}\n內容：${cmd.options.getString('value')}`, ephemeral: true });
        },
    },
    delete: {
        data: new SlashCommandBuilder()
            .setName('delete')
            .setDescription('刪除資料庫中的資料')
            .addNumberOption(op => op
                .setName('index')
                .setDescription('資料位址')
                .setRequired(true)),
        /**
         * @param {import('discord.js').CommandInteraction} cmd
         */
        do(cmd) {
            const dataDB = new DB(join(DB.dirPath, 'data.json'));
            const { data } = dataDB;
            const i = cmd.options.getNumber('index');
            if (!data[i]) return cmd.reply('尷尬，資料庫好像沒這東西');
            if (data[i].userId !== cmd.user.id) return cmd.reply('沒事不要亂動別人的保險櫃！');
            const val = data[i].value;
            delete data[i];
            dataDB.write();
            cmd.reply({ content: `成功刪除在位址${i}的內容${val}`, ephemeral: true });
        },
    },
    check: {
        data: new SlashCommandBuilder()
            .setName('check')
            .setDescription('查看資料庫中的資料')
            .addNumberOption(op => op
                .setName('index')
                .setDescription('資料位址')
                .setRequired(true)),
        /**
         * @param {import('discord.js').CommandInteraction} cmd
         */
        do(cmd) {
            const data = new DB(join(DB.dirPath, 'data.json')).data;
            const i = cmd.options.getNumber('index');
            if (!data[i]) return cmd.reply('尷尬，資料庫好像沒這東西');
            if (data[i].userId !== cmd.user.id) return cmd.reply('銀行會讓你查看別人的存款嗎？');
            cmd.reply({ content: `位址：${i}\n內容：${data[i].value}`, ephemeral: true });
        },
    },
};