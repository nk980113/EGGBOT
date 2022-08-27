const { google } = require('googleapis');
const { join } = require('node:path');

class DB {
    #sheetId;
    #subSheet;
    #keys;
    #entries = [];

    static #auth = new google.auth.GoogleAuth({
        keyFile: join(__dirname, '..', 'setup', 'google_credentials.json'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    static #authClient;
    /** @type {import('googleapis').sheets_v4.Resource$Spreadsheets} */
    static #googleSheet;
    static {
        (async () => {
            this.#authClient = await this.#auth.getClient();
            this.#googleSheet = google.sheets({ version: 'v4', auth: this.#authClient }).spreadsheets;
        })();
    }

    constructor({
        sheetId,
        subSheet,
        keys,
    }) {
        this.#sheetId = sheetId;
        this.#subSheet = subSheet;
        this.#keys = keys;
        this.sync();
    }

    async sync() {
        this.#entries = (await DB.#googleSheet.values.get({
            auth: DB.#auth,
            spreadsheetId: this.#sheetId,
            range: this.#subSheet,
            valueRenderOption: 'UNFORMATTED_VALUE',
        })).data.values.filter((r) => r.length > 0).map((r) => {
            const entry = {};
            r.forEach((v, i) => {
                if (v) {
                    entry[this.#keys[i]] = v;
                }
            });
            return entry;
        });
        return this.#entries;
    }

    async save() {
        await DB.#googleSheet.values.clear({
            spreadsheetId: this.#sheetId,
            range: this.#subSheet,
        });
        const finalColumn = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ'[this.#keys.length];
        return await DB.#googleSheet.values.append({
            auth: DB.#auth,
            spreadsheetId: this.#sheetId,
            range: `${this.#subSheet}!A:${finalColumn}`,
            valueInputOption: 'RAW',
            resource: {
                values: this.#entries.map((e) => this.#keys.map((k) => e[k])),
            },
        });
    }

    get entries() {
        return this.#entries;
    }
}

module.exports = DB;