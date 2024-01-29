const { parentPort } = require('node:worker_threads');

// format:
// {resource: '', method: '', metadata:}
// soup create: give answer content title authorId returns soupId
// soup createans: give soupId content author returns ansId
// soup edit: give answer content title soupId returns null
// soup delete: give soupId returns null
// soup deleteans: give soupId ansId returns null
// soup findallbyauthor: give authorId page returns soups[] totalPages
// soup findall: give page returns soups[] totalPages
// soup findallans: give soupId page returns anss[] totalPages
// soup findallansbyauthor: give soupId page authorId returns anss[] totalPages
// soup findansbyid: give soupId ansId returns ans
// soup findbyid: give soupId returns soup

(async () => {
    await require('./mongoose');
    const { Questions, Answers } = require('./mongoose/schemas/soup');

    parentPort.on('message', async (req) => {
        const { id, payload: { resource, method, metadata } } = req;
        try {
            switch (resource) {
                case 'soup': {
                    switch (method) {
                        case 'create': {
                            const doc = await Questions.create(metadata);
                            parentPort.postMessage({ success: true, id, metadata: { soupId: doc.soupId } });
                            break;
                        }

                        case 'createans': {
                            const q = await Questions.findOne({ soupId: metadata.soupId });
                            const ans = await q.createAnswer(metadata.content, metadata.by);
                            parentPort.postMessage({ success: true, id, metadata: ans.answerId });
                            break;
                        }

                        case 'delete': {
                            const q = await Questions.findOne({ soupId: metadata.soupId });
                            const oId = q._id;
                            await q.deleteOne();
                            await Answers.deleteMany({ original: oId });
                            parentPort.postMessage({ success: true, id, metadata: null });
                            break;
                        }

                        case 'deleteans': {
                            const q = await Questions.findOne({ soupId: metadata.soupId });
                            const oId = q._id;
                            await Answers.deleteOne({ answerId: metadata.answerId, original: oId });
                            parentPort.postMessage({ success: true, id, metadata: null });
                            break;
                        }

                        case 'edit': {
                            await Questions.updateOne({ soupId: metadata.soupId }, metadata);
                            parentPort.postMessage({ success: true, id, metadata: null });
                            break;
                        }

                        case 'findallans': {
                            const q = await Questions.findOne({ soupId: metadata.soupId });
                            const anss = Answers.find({ original: q._id });
                            const totalPages = Math.ceil(await anss.clone().countDocuments() / 25);
                            const rawTargetAnss = await anss.sort({ answerId: -1 }).skip(metadata.page * 25).limit(25);
                            const targetAnss = rawTargetAnss.map((ans) => ({
                                answerId: ans.answerId,
                                by: ans.by,
                                shortContent: ans.getShortContent(),
                                shortReply: ans.getReplyStatus(),
                            }));
                            parentPort.postMessage({ success: true, id, metadata: { anss: targetAnss, totalPages } });
                            break;
                        }

                        case 'findallansbyauthor': {
                            const q = await Questions.find({ soupId: metadata.soupId });
                            const anss = Answers.find({ original: q._id, by: metadata.authorId });
                            const totalPages = Math.ceil(await anss.clone().countDocuments() / 25);
                            const rawTargetAnss = await anss.sort({ answerId: -1 }).skip(metadata.page * 25).limit(25);
                            const targetAnss = rawTargetAnss.map((ans) => ({
                                answerId: ans.answerId,
                                by: ans.by,
                                shortContent: ans.getShortContent(),
                                shortReply: ans.getReplyStatus(),
                            }));
                            parentPort.postMessage({ success: true, id, metadata: { anss: targetAnss, totalPages } });
                            break;
                        }

                        case 'findallbyauthor': {
                            const soups = Questions.find({ authorId: metadata.authorId });
                            const totalPages = Math.ceil(await soups.clone().countDocuments() / 25);
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
                            const totalPages = Math.ceil(await soups.clone().countDocuments() / 25);
                            const rawTargetSoups = await soups.sort({ soupId: -1 }).skip(metadata.page * 25).limit(25);
                            const targetSoups = rawTargetSoups.map((soup) => ({
                                soupId: soup.soupId,
                                title: soup.title,
                                shortContent: soup.getShortContent(),
                            }));
                            parentPort.postMessage({ success: true, id, metadata: { soups: targetSoups, totalPages } });
                            break;
                        }

                        case 'findansbyid': {
                            const { soupId, answerId } = metadata;
                            const q = await Questions.findOne({ soupId });
                            const foundAns = await Answers.findOne({ answerId: answerId, original: q._id });
                            parentPort.postMessage({ success: true, id, metadata: {
                                content: foundAns.content,
                                by: foundAns.by,
                                timestamp: foundAns.timestamp,
                                reply: foundAns.reply,
                            } });
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
