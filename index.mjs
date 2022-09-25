process.env.TZ = 'Asia/Taipei';

import { Worker } from 'node:worker_threads';
import chalk from 'chalk';

// eslint-disable-next-line no-inline-comments
const totalThreadsToLaunch = 1 /* 2 */;
let totalThreadsLaunched = 0;

// TODO: switch to sharding mode
const botThread = new Worker('./discord.js');
// const apiThread = new Worker('./api-endpoint.js');

botThread.on('online', () => {
    console.log(`[${Date()}] ${chalk.black.bgGreen('[LAUNCH]')} (${++totalThreadsLaunched}/${totalThreadsToLaunch}) bot thread launched`);
});
/*
apiThread.on('online', () => {
    console.log(`[${Date()}] ${chalk.black.bgGreen('[LAUNCH]')} (${++totalThreadsLaunched}/${totalThreadsToLaunch}) database api endpoint thread launched`);
});
*/

botThread.on('message', (v) => {
    const { type, msg, timestamp } = v;
    const formattedType =
        type === 'info' ? chalk.blue(type)
            : type === 'error' ? chalk.red(type) : type;

    console.log(`[${new Date(timestamp).toDateString()}] ${chalk.yellow('[BOT]')} ${formattedType} ${msg}`);
});

botThread.on('error', (e) => {
    console.log(chalk.red(`[${Date()}] [BOT] error A uncaught error occured. Aborting...`));
    console.log(e);
    // apiThread.terminate();
    process.exit(1);
});