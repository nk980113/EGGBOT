const { readFileSync, writeFileSync } = require('fs');

class DB {

    static dirPath = __dirname;

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

module.exports = DB;