const { soup } = require('../connections');
const { Schema } = require('mongoose');

const questionSchema = new Schema({
    soupId: {
        type: Number,
        required: true,
        default: 0,
    },
    timestamp: {
        type: Number,
        required: true,
        default: Date.now,
    },
    authorId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    publicAnswer: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    methods: {
        getShortContent() {
            return this.content.length >= 20
                ? `${this.content.slice(0, 18)}...`
                : this.content;
        },
        async createAnswer(content, by) {
            const answer = await Answers.create({
                original: this._id,
                content,
                by,
            });
            return answer;
        },
    },
    statics: {
        async getNextId() {
            const soupWithMaxId = await this.find().sort({ soupId: -1 }).findOne();
            if (!soupWithMaxId) return 1;
            return soupWithMaxId.soupId + 1;
        },
    },
});

const answerSchema = new Schema({
    original: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    answerId: {
        type: Number,
        required: true,
        default: 0,
    },
    by: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Number,
        required: true,
        default: Date.now,
    },
    reply: {
        status: {
            type: String,
            required: true,
            enum: ['not replyed', 'correct', 'incorrect', 'not correlated', 'can\'t reply', 'solution', 'opposite solution'],
            default: 'not replyed',
        },
        important: {
            type: Boolean,
            required: true,
            default: false,
        },
        content: String,
    },
}, {
    methods: {
        getShortContent() {
            return this.content.length >= 30
                ? `${this.content.slice(0, 18)}...`
                : this.content;
        },
        getReplyStatus() {
            let state = '';
            switch (this.reply.status) {
                case 'correct': {
                    state = '✅';
                    break;
                }
                case 'incorrect': {
                    state = '❎';
                    break;
                }
                case 'not correlated':
                case 'can\'t reply': {
                    state = '🙊';
                    break;
                }
                case 'solution': {
                    state = '✅⭐';
                    break;
                }
                case 'opposite solution': {
                    state = '❎⭐';
                    break;
                }
            }
            if (this.reply.important) {
                return state + '👍';
            }
            return state;
        },
    },
});

questionSchema.pre('save', async function() {
    this.soupId = await Questions.getNextId();
});

answerSchema.pre('save', async function() {
    const ansWithMaxId = await Answers.find({ original: this.original }).sort({ answerId: -1 }).findOne();
    if (!ansWithMaxId) return this.answerId = 1;
    this.answerId = ansWithMaxId.answerId + 1;
});

const Questions = soup.model('Question', questionSchema);
const Answers = soup.model('Answer', answerSchema);

module.exports = {
    Questions,
    Answers,
};
