const DB = require('.');
const sheetId = require('../setup/token.json').sheets.turtle;

module.exports = {
    soup: new DB({
        sheetId,
        subSheet: 'soup',
        keys: ['soupId', 'authorId', 'title', 'content', 'publicAnswer', 'answer'],
    }),
};