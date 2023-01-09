const { appendFileSync, readFileSync, writeFileSync } = require('node:fs');
const { parentPort } = require('node:worker_threads');

const logger = {
    info(msg, toOuterPort = false) {
        if (toOuterPort) {
            this.messageToOuterPort(msg, 'info');
        }
        return this.writeToFile(msg, 'info');
    },
    error(msg, toOuterPort = false) {
        if (!toOuterPort) {
            this.messageToOuterPort(msg, 'error');
        }
        return this.writeToFile(msg, 'error');
    },
    /**
     * @returns {{ type: string, msg: string, timestamp: number }[]}
     */
    getLog() {
        const file = readFileSync('./log.txt', { encoding: 'utf-8' });
        writeFileSync('./log.txt', '');
        return file.split(/\r?\n/g).filter((l) => Boolean(l)).map((l) => JSON.parse(l));
    },
    writeToFile(msg, type) {
        appendFileSync('./log.txt', JSON.stringify({ type, msg, timestamp: Date.now() }) + '\n');
    },
    messageToOuterPort(msg, type) {
        parentPort.postMessage({ type, msg, timestamp: Date.now() });
    },
};

module.exports = logger;
