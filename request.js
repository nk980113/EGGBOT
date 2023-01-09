const { parentPort } = require('node:worker_threads');

let lastReqId = 0;

/**
 *
 * @param {{ resource: string, method: string, metadata: any }} payload
 * @returns {Promise<{ success: true, metadata: any } | { success: false, error: Error }>}
 */
function request(payload) {
    const reqId = lastReqId++;
    return new Promise((res) => {
        parentPort.once('message', (msg) => {
            if (msg.id === reqId) res(msg);
        });
        parentPort.postMessage({
            type: 'request',
            id: reqId,
            payload,
        });
    });
}

module.exports = request;
