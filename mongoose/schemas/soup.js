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
    answers: [{
        type: Schema.Types.ObjectId,
        ref: 'Answer',
    }],
}, {
    methods: {
        getShortContent() {
            return this.content.length >= 20
                ? `${this.content.slice(0, 18)}...`
                : this.content;
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
    reply: {
        replied: {
            type: Boolean,
            required: true,
            default: false,
        },
        public: {
            type: Boolean,
            required: true,
            default: false,
        },
        status: {
            type: String,
            required: true,
            enum: ['not replyed', 'correct', 'incorrect', 'not correlated', 'can\'t reply', 'solution', 'opposite solution'],
        },
        important: {
            type: Boolean,
            required: true,
            default: false,
        },
        content: {
            type: String,
            required: true,
        },
    },
});

questionSchema.pre('save', async function() {
    this.soupId = await Questions.getNextId();
});

const Questions = soup.model('Question', questionSchema);
const Answers = soup.model('Answer', answerSchema);

module.exports = {
    Questions,
    Answers,
};
