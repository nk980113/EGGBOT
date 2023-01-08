process.env.TZ = 'Asia/Taipei';

import { Worker } from 'node:worker_threads';
import chalk from 'chalk';
import dayjs from 'dayjs';

const dayjsFormat = 'YYYY MMM DD HH:mm:ss.SSS';

// eslint-disable-next-line no-inline-comments
const totalThreadsToLaunch = 2 /* 2 */;
let totalThreadsLaunched = 0;

// TODO: switch to sharding mode
const botThread = new Worker('./discord.js', { env: { ...process.env, timestamp: Date.now() } });
const apiThread = new Worker('./api-endpoint.js');

botThread.on('online', () => {
    console.log(`[${dayjs().format(dayjsFormat)}] ${chalk.black.bgGreen('[LAUNCH]')} (${++totalThreadsLaunched}/${totalThreadsToLaunch}) bot thread launched`);
});

apiThread.on('online', () => {
    console.log(`[${dayjs().format(dayjsFormat)}] ${chalk.black.bgGreen('[LAUNCH]')} (${++totalThreadsLaunched}/${totalThreadsToLaunch}) database api endpoint thread launched`);
});

botThread.on('message', (v) => {
    if (v.type === 'request') return handleRequest(v);
    const { type, msg, timestamp } = v;
    const formattedType =
        type === 'info' ? chalk.blue(type)
            : type === 'error' ? chalk.red(type) : type;

    console.log(`[${dayjs(timestamp).format(dayjsFormat)}] ${chalk.yellow('[BOT]')} ${formattedType} ${msg}`);
});

botThread.on('error', (e) => {
    console.log(chalk.red(`[${dayjs().format(dayjsFormat)}] [BOT] error A uncaught error occured. Aborting...`));
    console.log(e);
    process.exit(1);
});

botThread.on('exit', () => {
    apiThread.terminate();
});

apiThread.on('exit', () => {
    botThread.terminate();
});

apiThread.on('message', (res) => {
    botThread.postMessage(res);
});

function handleRequest(req) {
    apiThread.postMessage(req);
}