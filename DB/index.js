const { readFileSync, writeFileSync } = require('fs');

class DB {
    /**
     * @param {string} dbPath
     */
    constructor(dbPath) {
        this.path = dbPath;
        this.read();
    }

    read() {
        this.data = JSON.parse(readFileSync(this.path, { encoding: 'utf-8' }));
    }

    write() {
        writeFileSync(this.path, JSON.stringify(this.data), { encoding: 'utf-8' });
    }
}

DB.dirPath = __dirname;
module.exports = DB;