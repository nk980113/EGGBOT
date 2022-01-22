const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { join } = require('path');
const DB = require('../../DB');
const soupDirPath = join(DB.dirPath, 'Soup');

/**
 * @param {string} id
 * @returns {[string, string[]]}
 */
const argParser = (id) => {
    const splited = id.split(' ');
    return [splited.shift(), splited.slice(1)];
};

/**
 * @type {{
 *      [cmd: string]: ((btn: import('discord.js').ButtonInteraction, ...args: string[]) => *);
 * }}
 */
const handleFuncs = {
    Shlp(btn) {
        btn.update({
            ephemeral: true,
            embeds: [
                new MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle('幫助——海龜湯')
                    .setDescription('海龜湯介紹： http://gameschool.cc/game/category/11/wiki/intro/')
                    .addField('出題及提問前注意事項：', '由於Discord官方的限制，輸入任何文字前必須先使用/save指令儲存文字，並記錄資料庫位址，才可以使用文字功能喔！')
                    .addField('搜尋海龜湯：', '以關鍵字搜尋海龜湯，-會被當成空格，空格用來分隔關鍵字。')
                    .addField('查看所有海龜湯：', '查看所有海龜湯，可選擇排序方式')
                    .addField('管理海龜湯：', '可在此處編輯你所有的海龜湯')
                    .addField('幫助：', '你應該已經點過這個鍵了吧？'),
            ],
            components: [
                new MessageActionRow()
                    .addComponents(require('../../btnTemp/Soup/Shal')(btn.user.id)),
            ],
        });
    },
    Shal(btn) {
        btn.update({
            ...require('../../msgTemp/turtle-soup')(btn.user.id),
            ephemeral: true,
        });
    },
    Smod(btn, pg) {
        const quesDB = new DB(join(soupDirPath, 'questions.json'));
        const questions = Object.keys(quesDB.data).filter(k => quesDB.data[k].author === btn.user.id).map(k => quesDB.data[k]).sort((a, b) => b.id - a.id);
        const embed = new MessageEmbed;
        embed
            .setColor('GREYPLE')
            .setTitle('你煮過的湯');
        if (!questions.length && !pg) embed.addField('這裡空空如也', '看來你是個菜鳥廚師～');
        else questions.filter((_, i) => i >= pg * 10 && i < (pg + 1) * 10).forEach(q => {
            embed.addField(`#${q.id} ${q.title}`, q.content.length <= 20 ? q.content : q.content.slice(0, 19) + '...');
        });
        const totalPg = `共${Math.ceil(questions.length / 10)}頁，這是第${+pg + 1}頁`;
        embed.setFooter({ text: totalPg });
        btn.update({
            embeds: [embed],
            ephemeral: true,
            components: [
                ...require('../../btnTemp/Row/1-10')('Sque', btn.user.id, '', questions.length - pg * 10 >= 10 ? 11 : questions.length - pg * 10 + 1),
                new MessageActionRow()
                    .addComponents(new MessageButton().setStyle('PRIMARY').setCustomId(`Smod ${btn.user.id} ${pg - 1}`).setLabel('<').setDisabled(!+pg))
                    .addComponents(new MessageButton().setStyle('PRIMARY').setCustomId(`Smod ${btn.user.id} ${pg + 1}`).setLabel('>').setDisabled(questions.length - (+pg + 1) * 10 <= 0))
                    .addComponents(require('../../btnTemp/Soup/Shal')(btn.user.id)),
            ],
        });
    },
    Sall(btn, pg) {
        const quesDB = new DB(join(soupDirPath, 'questions.json'));
        const questions = Object.keys(quesDB.data).map(k => quesDB.data[k]).sort((a, b) => b.id - a.id);
        const embed = new MessageEmbed;
        embed
            .setColor('NOT_QUITE_BLACK')
            .setTitle('所有海龜湯');
        if (!questions.length && !pg) embed.addField('這裡空空如也', '看看門口的招牌，你是不是走錯餐廳了？');
        else questions.filter((_, i) => i >= pg * 10 && i < (pg + 1) * 10).forEach(q => {
            embed.addField(`#${q.id} ${q.title}`, q.content.length <= 20 ? q.content : q.content.slice(0, 19) + '...');
        });
        const totalPg = `共${Math.ceil(questions.length / 10)}頁，這是第${+pg + 1}頁`;
        embed.setFooter({ text: totalPg });
        btn.update({
            embeds: [embed],
            ephemeral: true,
            components: [
                ...require('../../btnTemp/Row/1-10')('Sque', btn.user.id, '', questions.length - pg * 10 >= 10 ? 11 : questions.length - pg * 10 + 1),
                new MessageActionRow()
                    .addComponents(new MessageButton().setStyle('PRIMARY').setCustomId(`Sall ${btn.user.id} ${pg - 1}`).setLabel('<').setDisabled(!+pg))
                    .addComponents(new MessageButton().setStyle('PRIMARY').setCustomId(`Sall ${btn.user.id} ${pg + 1}`).setLabel('>').setDisabled(questions.length - (+pg + 1) * 10 <= 0))
                    .addComponents(require('../../btnTemp/Soup/Shal')(btn.user.id)),
            ],
        });
    },
};

/**
 * @param {import('discord.js').ButtonInteraction} btn
 */
const soupHandler = btn => {
    const [cmd, args] = argParser(btn.customId);
    handleFuncs[cmd](btn, ...args);
};

module.exports = soupHandler;
