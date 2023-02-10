const { parentPort } = require('node:worker_threads');
const { AsyncQueue } = require('@sapphire/async-queue');

// format:
// {resource: '', method: '', metadata:}
// soup create: give answer content title authorId returns soupId
// soup edit: give answer content title soupId returns null
// soup delete: give soupId returns null
// soup findallbyauthor: give authorId page returns soups[] totalPages
// soup findall: give page returns soups[] totalPages
// soup findbyid: give id returns soup

(async () => {
    await require('./mongoose');
    const { Questions } = require('./mongoose/schemas/soup');
    // prevent race condition
    const soupCreateQueue = new AsyncQueue;

    parentPort.on('message', async (req) => {
        const { id, payload: { resource, method, metadata } } = req;
        try {
            switch (resource) {
                case 'soup': {
                    switch (method) {
                        case 'create': {
                            await soupCreateQueue.wait();
                            const doc = await Questions.create(metadata);
                            parentPort.postMessage({ success: true, id, metadata: { soupId: doc.soupId } });
                            soupCreateQueue.shift();
                            break;
                        }

                        case 'delete': {
                            await Questions.deleteOne({ soupId: metadata.soupId });
                            parentPort.postMessage({ success: true, id, metadata: null });
                            break;
                        }

                        case 'edit': {
                            await Questions.updateOne({ soupId: metadata.soupId }, metadata);
                            parentPort.postMessage({ success: true, id, metadata: null });
                            break;
                        }

                        case 'findallbyauthor': {
                            const soups = Questions.find({ authorId: metadata.authorId });
                            const totalPages = await new Promise((res, rej) => {
                                soups.clone().countDocuments((err, count) => {
                                    if (err) rej(err);
                                    res(Math.ceil(count / 25));
                                });
                            });
                            const rawTargetSoups = await soups.sort({ soupId: -1 }).skip(metadata.page * 25).limit(25);
                            const targetSoups = rawTargetSoups.map((soup) => ({
                                soupId: soup.soupId,
                                title: soup.title,
                                shortContent: soup.getShortContent(),
                            }));
                            parentPort.postMessage({ success: true, id, metadata: { soups: targetSoups, totalPages } });
                            break;
                        }

                        case 'findall': {
                            const soups = Questions.find();
                            const totalPages = await new Promise((res, rej) => {
                                soups.clone().countDocuments((err, count) => {
                                    if (err) rej(err);
                                    res(Math.ceil(count / 25));
                                });
                            });
                            const rawTargetSoups = (await soups.sort({ soupId: -1 })).slice(metadata.page * 25, (metadata.page + 1) * 25);
                            const targetSoups = rawTargetSoups.map((soup) => ({
                                soupId: soup.soupId,
                                title: soup.title,
                                shortContent: soup.getShortContent(),
                            }));
                            parentPort.postMessage({ success: true, id, metadata: { soups: targetSoups, totalPages } });
                            break;
                        }

                        case 'findbyid': {
                            const foundSoup = await Questions.findOne({ soupId: metadata.id });
                            parentPort.postMessage({ success: true, id, metadata: {
                                soupId: foundSoup.soupId,
                                timestamp: foundSoup.timestamp,
                                answer: foundSoup.answer,
                                content: foundSoup.content,
                                title: foundSoup.title,
                                publicAnswer: foundSoup.publicAnswer,
                                authorId: foundSoup.authorId,
                            } });
                            break;
                        }

                        default: {
                            parentPort.postMessage({ success: false, error: new TypeError('Invalid method for resource soup was given') });
                        }
                    }
                    break;
                }
            }
        } catch (e) {
            parentPort.postMessage({ success: false, id, error: e });
        }
    });
})();
